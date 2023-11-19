from threading import Thread
from typing import List

import requests
from fastapi_events.dispatcher import dispatch
from pymongo import ReplaceOne, WriteConcern

from classes.Article import Article
from crystalspider.index import ArticleConnections
from db import db_controller
from loguru import logger
from clients import host_models_client
from tools.articles import get_id


class ArticlesList(list[Article]):
    def __init__(self, articles: list[Article]):
        super().__init__(articles)

    def rank(self, query: str):
        logger.info(f"Ranking {len(self)} articles")
        abstracts = [article.title + " ".join(article.keywords) + " ".join(article.lemmas) for article in self]
        logger.info(f"Requesting scores for {len(abstracts)} abstracts")
        paragraph_scores = host_models_client.normalized_paragraph_scores(query, abstracts)
        for score in paragraph_scores:
            self[score['paragraph']].set_score(score['score'])

        self.sort(key=lambda x: x.score, reverse=True)

    def db_save(self):
        ids = [article.id for article in self]
        articles_in_db = list(db_controller.get_collection().find(
            {'$or': [{'_id': {'$in': ids}}, {'id': {'$in': ids}}]},
            {'_id': 1, 'id': 1}
        ))
        articles_in_db_ids = [get_id(article) for article in articles_in_db]
        articles_to_insert = [article for article in self if get_id(article) not in articles_in_db_ids]
        logger.info(f"Found {len(articles_to_insert)} articles to insert into the database")
        logger.debug(f"Inserting: {', '.join([get_id(article) for article in articles_to_insert])}")
        if len(articles_to_insert) > 0:
            logger.info(f"Inserting {len(articles_to_insert)} articles into the database")
            db_controller \
                .get_collection() \
                .insert_many([article.to_dict() for article in articles_to_insert])
            logger.success(f"Inserted {len(articles_to_insert)} articles into the database")

            ArticleConnections.add_articles_to_index(articles_to_insert)
