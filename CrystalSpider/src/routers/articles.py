import traceback

from fastapi import APIRouter, Response
from fastapi_events.dispatcher import dispatch
from fastapi_events.handlers.local import local_handler
from fastapi_events.typing import Event
from loguru import logger

from classes.Article import Article
from classes.FullArticle import FullPMCArticle, SharePointArticle
from crystalspider.core import ArticleManager
from crystalspider.index import ArticleConnections
from tools.pmc import get_pmc_pdf_url
from classes.Exceptions import PDFException
from classes.ArticlesList import ArticlesList
from db import db_controller
from clients.entrez import correct_query

router = APIRouter()
article_connections = ArticleConnections()


@router.get('/home', status_code=200)
async def home_endpoint(response: Response):
    def article_cleanup(article):
        article['id'] = article.pop('_id')
        return article

    try:
        return list(
            map(article_cleanup, db_controller.get_collection().find({}, {'full_text': 0}).sort('clicks', -1).limit(6)))
    except Exception as e:
        logger.error("Error while fetching home page articles")
        logger.exception(e)
        response.status_code = 500
        response.content = {
            "error": str(e),
            "stacktrace": traceback.format_exc()
        }
        return


@router.get('/search', status_code=200)
def search_endpoint(query: str, response: Response, qty: int = 30, filter: int = 3, override_correct: bool = False):
    try:
        corrected_query = correct_query(query)

        used_query = corrected_query if not override_correct else query

        futures = ArticleManager.fetch_articles_async(used_query, filter, qty=qty * 3)

        articles = ArticlesList([])
        for future in futures:
            articles.extend(future.result(timeout=20) or [])
        if not articles:
            return []

        articles.db_save()
        articles.rank(used_query)
        return {
            "query": query,
            "corrected_query": corrected_query,
            "corrected": corrected_query.lower() != query.lower() and not override_correct,
            "articles": articles[:qty],
        }
    except Exception as e:
        logger.error("Error while fetching home page articles")
        logger.exception(e)
        response.status_code = 500
        response.content = {
            "error": str(e),
            "stacktrace": traceback.format_exc()
        }
        return


@router.get('/article', status_code=200)
def article_endpoint(id: str, response: Response, query: str = None):
    try:
        record = db_controller.get_collection().find_one({
            '$or': [{'id': id}, {'_id': id}]
        })
        if record is None:
            response.status_code = 404
            return "Article not found"

        already_has_full_text = 'full_text' in record
        article = FullPMCArticle(record, query) if record['source'] == "PMC" else SharePointArticle(record, query)
        if not already_has_full_text:
            dispatch("new-fulltext-added", payload=article)
        return article.to_dict()
    except PDFException as e:
        response.status_code = 314
        response.headers['location'] = f"https://www.ncbi.nlm.nih.gov/pmc/articles/{e.pmc_id}"
        return "PDF exception - redirecting to PMC"

    except Exception as e:
        logger.error("Error while fetching home page articles")
        logger.exception(e)
        response.status_code = 500
        response.content = {
            "error": str(e),
            "stacktrace": traceback.format_exc()
        }
        return


@router.get('/download_pdf', status_code=200)
def download_pdf_endpoint(id: str, response: Response):
    try:
        if id.startswith("PMC") and "pdf" not in id:
            pdf_url, redirect_url = get_pmc_pdf_url(id)
            if pdf_url:
                response.status_code = 200
                return {"path": pdf_url}
            else:
                response.status_code = 303
                response.headers['location'] = redirect_url
        else:
            sharepoint_article_path = db_controller.get_collection().find_one({
                '$or': [
                    {'pmc_id': id}, {'id': id}, {'_id': id}
                ]})
            return {"path": sharepoint_article_path}
    except Exception as e:
        logger.error("Error while fetching home page articles")
        logger.exception(e)
        response.status_code = 500
        response.content = {
            "error": str(e),
            "stacktrace": traceback.format_exc()
        }
        return


@router.get('/connected_articles', status_code=200)
def connected_articles_endpoint(id: str, response: Response):
    # return 400 is empty id
    if not id:
        response.status_code = 400
        return {
            "error": "Empty id"
        }
    connected_articles = article_connections.get_similar_articles(id)
    return connected_articles
