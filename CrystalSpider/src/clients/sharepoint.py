from __future__ import annotations

import io
import os
from dataclasses import dataclass
from time import time, sleep

import pypeln as pl
from office365.runtime.auth.user_credential import UserCredential
from office365.sharepoint.client_context import ClientContext
from office365.sharepoint.files.file import File
from office365.sharepoint.search.query.sort.sort import Sort
from office365.sharepoint.search.request import SearchRequest
from office365.sharepoint.search.service import SearchService
from loguru import logger


from . import MeilisearchClient, GrobidClient


@dataclass
class SPDoc:
    Path: str
    Title: str
    FileType: str
    LastModifiedTime: str
    DocId: str
    ContentBuffer: io.BytesIO = None

    def to_dict(self):
        return {
            'Path': self.Path,
            'Title': self.Title,
            'FileType': self.FileType,
            'LastModifiedTime': self.LastModifiedTime,
            'DocId': self.DocId
        }


class FormatAdapter:
    supported_formats = ["pdf"]

    @staticmethod
    def to_pdf(doc: SPDoc) -> SPDoc:
        logger.debug(f"Converting {doc.FileType} to pdf")
        if doc.FileType == "pdf":
            return doc
        elif doc.FileType == "pptx" or doc.FileType == "ppt":
            doc.ContentBuffer = FormatAdapter._pptx_to_pdf(doc.ContentBuffer)
            return doc
        else:
            raise Exception("Unsupported doc")

    @staticmethod
    def _pptx_to_pdf(buffer: io.BytesIO) -> io.BytesIO:
        pass  # todo


class SharePointClient:
    sp_credentials = UserCredential(os.environ.get('SP_USER'), os.environ.get('SP_PASS'))
    sp_context = ClientContext(os.environ.get('SP_URL')).with_credentials(sp_credentials)
    sp_search = SearchService(sp_context)

    EDM_MAX_INT = 2147483647

    def download_file(self, uri) -> io.BytesIO:
        logger.debug("Downloading file from uri: " + uri)
        buffer = io.BytesIO()
        File.from_url(uri) \
            .with_credentials(self.sp_credentials) \
            .download(buffer) \
            .execute_query()

        logger.debug(f'Downloaded from {uri}: {buffer.getbuffer().nbytes} bytes')
        buffer.seek(0)
        return buffer

    @staticmethod
    def _extract_cell_value(key, cells):
        return [cells[index]['Value'] for index in cells if cells[index]['Key'] == key][0]

    def search(self, query) -> [SPDoc]:
        """
        Caveats:
        1) Sharepoint search is limited to a hard 500 rows per page. So we need to paginate queries by 500 increments.
        http://the-sharepoint.blogspot.com/2015/12/strangeunexpectedfrustrating-in-place.html

        2) Sharepoint is limiting the API to 25rq/s. We we behave ourselves well.
        https://learn.microsoft.com/en-us/sharepoint/dev/general-development/how-to-avoid-getting-throttled-or-blocked-in-sharepoint-online
        """
        logger.debug(f"Executing query: {query}")
        rows_per_page = 500
        current_start_row = 0
        total_rows = -1
        results: [SPDoc] = []

        _25hz_sleep_interval = 0.04  # ms
        last_search = time()
        is_done = False
        while not is_done:
            logger.debug(f"Running paged query starting {current_start_row} for {rows_per_page} rows..")
            request = SearchRequest(query_text=query,
                                    sort_list=[Sort("LastModifiedTime", 1)],
                                    rows_per_page=rows_per_page,
                                    start_row=current_start_row,
                                    row_limit=self.EDM_MAX_INT)
            if time() <= last_search + _25hz_sleep_interval:
                sleep(_25hz_sleep_interval)
            logger.debug("Executing search request")
            result = self.sp_search.post_query(request).execute_query()
            last_search = time()

            logger.debug("Extracting results from SP response")
            relevant_results = result.value.PrimaryQueryResult.RelevantResults
            total_rows = relevant_results['TotalRows']
            logger.trace(f"Found {total_rows} results")
            for row_index in relevant_results['Table']['Rows']:
                cells = relevant_results['Table']['Rows'][row_index]['Cells']
                results.append(SPDoc(
                    Path=self._extract_cell_value('Path', cells),
                    LastModifiedTime=self._extract_cell_value('LastModifiedTime', cells),
                    DocId=self._extract_cell_value('DocId', cells),
                    Title=self._extract_cell_value('Title', cells),
                    FileType=self._extract_cell_value('FileType', cells),
                ))
            current_start_row += rows_per_page
            if current_start_row >= total_rows or (
                    os.getenv('SP_MAX_TEST_ROWS') and len(results) >= int(os.getenv('SP_MAX_TEST_ROWS'))):
                is_done = True
        logger.debug(f"Found {len(results)} results")
        assert len(results) == total_rows or (
                    os.getenv('SP_MAX_TEST_ROWS') and len(results) >= int(os.environ.get('SP_MAX_TEST_ROWS')))
        return results


class SharePointCrawler:
    def __init__(self, grobid_client_instance: GrobidClient = None):
        self.grobid_client = grobid_client_instance or GrobidClient()
        self.sp_client = SharePointClient()
        self.meilisearch_client = MeilisearchClient()

    def crawl(self, query):
        logger.info(f"Starting crawl for query: {query}")
        results = self.sp_client.search(query)
        stage = pl.task.map(self.process_sp_doc, results,
                            workers=int(os.environ.get('SP_CRAWL_PARALLELIZATION_FACTOR', 1)))
        return list(stage)

    def process_sp_doc(self, sp_doc: SPDoc):
        from classes.Article import SharePointArticle

        logger.info(f"Processing SP doc: {sp_doc}")
        if sp_doc.ContentBuffer is None:
            sp_doc.ContentBuffer = self.sp_client.download_file(sp_doc.Path)

        sp_doc = FormatAdapter.to_pdf(sp_doc)
        tei = self.grobid_client.extract_pdf_headers(sp_doc.ContentBuffer)
        if tei is None:
            logger.error(f"Failed to extract headers from {sp_doc}")
            return None
        logger.success("Successfully processed SP doc: " + str(sp_doc))
        article = SharePointArticle(obj={
            **sp_doc.to_dict(),
            **tei
        }, query='')
        if not self.article_eligible_for_indexing(article):
            logger.warning(f"Article {article} is not eligible for indexing")
            return None

        logger.info("Saving article to index")
        self.meilisearch_client.add_document(article)
        logger.success(f"Successfully saved article {article} to index")

        logger.info(f"Persisting article: {article} to DB")
        article.persist()
        logger.success(f"Successfully persisted article: {article} to DB")
        return article

    @staticmethod
    def article_eligible_for_indexing(article) -> bool:
        # rudimentary for now
        return article.title is not None and article.title != '' and article.abstract is not None and article.abstract != ''
        pass
