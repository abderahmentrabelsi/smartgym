from concurrent.futures import ThreadPoolExecutor
from itertools import repeat

from classes.Article import PMCArticle, SharePointArticle, Article
from classes.FullArticle import SharePointArticle, FullPMCArticle
from clients import meilisearch_client
from clients.entrez import search, fetch_details
from db import db_controller
from tools.articles import get_id


class ArticleManager:
    def __init__(self, db):
        self.db = db

    @staticmethod
    def _get_pmc_articles(query: str, qty: int = 100) -> list[PMCArticle]:
        ids = search(query, qty=qty)
        articles = fetch_details(ids)
        if "PubmedArticle" not in articles:
            return []
        articles = articles['PubmedArticle']
        if len(articles) == 0:
            return []

        with ThreadPoolExecutor(max_workers=len(articles)) as pool:
            articles = list(pool.map(PMCArticle, articles, repeat(query, len(articles))))
            pool.shutdown(wait=True)
        return articles

    @staticmethod
    def _get_sharepoint_articles(query: str, qty: int = 20) -> list[SharePointArticle]:
        ids = meilisearch_client.search_ids(query, limit=qty)
        articles = db_controller.id_search(ids)
        if len(articles) == 0:
            return []

        with ThreadPoolExecutor(max_workers=len(articles)) as pool:
            articles = list(pool.map(SharePointArticle, articles, repeat(query, len(articles))))
            pool.shutdown(wait=True)
        return articles

    @staticmethod
    def fetch_articles_async(query: str, filter: int, qty: int = 100):
        futures = []
        with ThreadPoolExecutor(max_workers=2) as pool:
            if filter & 1:
                futures.append(pool.submit(ArticleManager._get_pmc_articles, query, qty=qty))
            if filter & 2:
                futures.append(pool.submit(ArticleManager._get_sharepoint_articles, query, qty=qty))
            pool.shutdown(wait=True)
        return futures
