from loguru import logger
from pymongo import UpdateOne

from clients import HostedModelsClient
from crystalspider.faiss_wrapper import FaissIndexWrapper  # Change this import to the correct path
from db import db_controller
from tools.articles import get_id
from tools.hash import reversible_hash
from tools.stopwords import remove_stopwords


class ArticleConnections:
    client = HostedModelsClient()
    collection = db_controller.get_collection()
    ann_index: FaissIndexWrapper = FaissIndexWrapper()

    def __init__(self):
        logger.info("Initializing Article Connections")
        logger.debug("Getting articles with missing embeddings")
        articles = list(self.collection.find({"vector": {"$exists": False}}))
        logger.debug(f"Found {len(articles)} articles with missing embeddings")
        self._insert_missing_embeddings(articles)
        logger.info("Consolidating embeddings into ANN Index")
        articles = list(self.collection.find({"vector": {"$exists": True}}))
        missing_articles = [article for article in articles if not reversible_hash.has_index(get_id(article))]
        logger.debug(f"Found {len(missing_articles)} articles missing from ANN Index")
        if len(missing_articles) > 0:
            logger.info("Adding missing articles to ANN Index")
            self.ann_index.bulk_add_items([(get_id(article), article['vector']) for article in missing_articles])
            logger.success("Added missing articles to ANN Index")
        logger.success("Initialized Article Connections")

    @classmethod
    def _get_embedding_beacon(cls, article):
        return remove_stopwords(article['title'] + article['abstract'])

    @classmethod
    def _insert_missing_embeddings(cls, articles):
        logger.info("Calculating missing embeddings")
        texts = [cls._get_embedding_beacon(article) for article in articles]
        embeddings = cls.client.generate_embeddings(texts)
        update_operations = [
            UpdateOne({"_id": get_id(article)}, {"$set": {"vector": vec}})
            for article, vec in zip(articles, embeddings)
        ]
        if len(update_operations) > 0:
            logger.info("Inserting embeddings into database")
            cls.collection.bulk_write(update_operations)
            logger.success("Inserted missing embeddings")
        else:
            logger.info("No missing embeddings to insert")

    @classmethod
    def get_similar_articles(cls, article_id: str, n=10):
        logger.debug(f"Getting similar articles for article {article_id}")
        article = cls.collection.find_one({"_id": article_id})
        cls.ann_index.add_item(article_id, article['vector'])  # Ensure the target article is in the index
        similar_article_ids = cls.ann_index.get_similar_by_id(article_id, k=n+1)  # Search for n+1 similar articles to account for the target article itself
        similar_article_ids = [item for item in similar_article_ids if item[0] != article_id]
        logger.debug(f"ANN: Found {len(similar_article_ids)} similar articles for article {article_id}")
        similar_articles = cls.collection.find({"_id": {"$in": [item[0] for item in similar_article_ids]}})
        connections = [
            {"id": get_id(article), "title": article["title"], "distance": art_id[1]}
            for art_id, article in zip(similar_article_ids, similar_articles)
            if art_id[1] < 5  # Filter out articles with a distance greater than 5
        ]
        logger.success(f"Got {len(connections)} similar articles for article {article_id}")
        return connections

    @classmethod
    def add_articles_to_index(cls, articles_to_insert):
        logger.info(f"Adding {len(articles_to_insert)} articles to the Faiss index")
        embeddings = cls.client.generate_embeddings(
            [cls._get_embedding_beacon(article) for article in articles_to_insert]
        )
        db_controller.get_collection().bulk_write([
            UpdateOne({"_id": get_id(article)}, {"$set": {"vector": vec}})
            for article, vec in zip(articles_to_insert, embeddings)
        ])
        # get a list of tuples of the form (article_id, embedding)
        items = [(get_id(article), vec) for article, vec in zip(articles_to_insert, embeddings)]
        cls.ann_index.bulk_add_items(items)
        logger.success(f"Added {len(articles_to_insert)} articles to the Faiss index")