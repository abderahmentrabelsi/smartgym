import json
import os

from meilisearch import Client
from stop_words import get_stop_words


class MeilisearchClient:
    index = "sharepoint_articles"
    client = Client(os.environ.get('MEILISEARCH_HOST'), os.environ.get('MEILISEARCH_API_KEY'))
    SYNONYMS_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'synonyms.json')

    def add_document(self, article):
        self.client.index(self.index).add_documents([article.to_dict()])

    def search(self, query: str, offset: int = 0, limit: int = 50) -> dict[str, any]:
        return self.client.index(self.index).search(query, {"offset": offset, "limit": limit})

    def search_ids(self, query: str, offset: int = 0, limit: int = 50) -> list[str]:
        hits = self.client.index(self.index).search(query, {"offset": offset, "limit": limit})['hits']
        return [hit['id'] for hit in hits]

    def delete_all_documents(self):
        self.client.index(self.index).delete_all_documents()

    def configure_settings(self):
        # read SYNONYMS_PATH as a json object
        with open(self.SYNONYMS_PATH, 'r') as f:
            synonyms = json.load(f)
        self.client.index(self.index).update_synonyms(synonyms)
        self.client.index(self.index).update_stop_words(get_stop_words('english'))
        self.client.index(self.index).update_settings({
            'distinctAttribute': 'id',
            'displayedAttributes': ['id', 'title', 'abstract', 'authors', 'keywords', 'lemmas'],
            'searchableAttributes': ['id', 'title', 'abstract', 'authors', 'keywords', 'lemmas'],
            'filterableAttributes': ['id', 'title', 'abstract', 'authors', 'keywords', 'lemmas'],
            'rankingRules': [
                'exactness',
                "proximity",
                "words",
                "typo",
                "attribute",
                "sort"
            ]
        })
