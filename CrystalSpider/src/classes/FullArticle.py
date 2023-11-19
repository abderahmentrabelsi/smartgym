import io
import re
from abc import ABC, abstractmethod
from concurrent.futures import ThreadPoolExecutor
from functools import reduce
from threading import Thread
from grobid_client.api.pdf import process_fulltext_document
from grobid_client.models import Article as TEIArticle, ProcessForm
from grobid_client.types import File, TEI
from retrying import retry

from classes.Article import DBArticle, s
from classes.Exceptions import PDFNotFoundException, PDFDownloadException
from common.memoization import memoize_call
from db import db_controller
from clients import caching_expert_ai_client, host_models_client

from clients.sharepoint import SharePointClient
from loguru import logger

from clients import grobid_client


class FullArticle(DBArticle, ABC):
    def __init__(self, obj: dict, query: str):
        super().__init__(obj, query)
        self.clicks = "clicks" in obj and obj['clicks'] + 1 or 1
        if "full_text" in obj:
            self.full_text = obj['full_text']
        else:
            self.tei_article: TEIArticle = self.fetch_tei_article()
            self.full_text: dict = self.extract_full_text()
        if query is not None:
            self.paragraphs_score()

    @abstractmethod
    def fetch_tei_article(self):
        pass

    def extract_pdf(self, buffer):
        form = ProcessForm(
            input_=File(file_name=self.id, payload=buffer, mime_type="application/pdf")
        )
        logger.info(f"Extracting TEI from document: {self.id}")
        return TEI.parse(
            process_fulltext_document.sync_detailed(client=grobid_client.grobidClient, multipart_data=form).content)

    def extract_full_text(self):
        logger.info(f"Extracting full text from document: {self.id}")
        full_text = {}
        for section in self.tei_article.sections:
            if section.name is None or section.name.lower() == "title" or section.name.lower() == "abstract":
                continue
            if len(section.paragraphs) == 0:
                continue

            full_text[section.name] = {}
            full_text[section.name]['paragraphs'] = []
            for paragraph in section.paragraphs:
                if "formula" in paragraph.text.lower():
                    continue
                full_text[section.name]['paragraphs'].append({
                    'text': re.sub(
                        r"\[[0-9]+\]|Fig\. ?[0-9]+[a-zA-Z]*|\(?Table ?[0-9]+[a-zA-Z]*\)?",
                        "",
                        paragraph.text
                    )})
        logger.success(f"Extracted full text from document: {self.id}")
        return full_text

    @staticmethod
    @memoize_call
    def main_sentences(paragraph):
        main_sentences = caching_expert_ai_client.get_main_sentences(paragraph['text'])
        paragraph.update({"main_sentences": main_sentences})

    def paragraphs_score(self):
        try:
            logger.info(f"Calculating paragraphs score for document: {self.id}")
            paragraphs = self._extract_paragraphs()
            paragraphs_list = [paragraph['text'] for paragraph in paragraphs]

            paragraph_scores = host_models_client.normalized_paragraph_scores(self.query, paragraphs_list)

            for score in paragraph_scores:
                paragraphs[score['paragraph']]['score'] = score['score']

            self._process_top_paragraphs(paragraphs)

            for section in self.full_text:
                self._calculate_section_scores(section)

            logger.success(f"Calculated paragraphs score for document: {self.id}")
        except Exception as e:
            logger.exception(f"Error calculating paragraphs score for document: {self.id}, error: {e}")

    def _extract_paragraphs(self):
        return [paragraph for section in self.full_text for paragraph in self.full_text[section]['paragraphs']]

    def _process_top_paragraphs(self, paragraphs):
        top_paragraphs = sorted(paragraphs, key=lambda x: x['score'], reverse=True)[:5]
        with ThreadPoolExecutor(max_workers=10) as pool:
            list(pool.map(self.main_sentences, top_paragraphs))
            pool.shutdown(wait=True)

    def _calculate_section_scores(self, section):
        section_paragraphs = self.full_text[section]['paragraphs']
        self.full_text[section]['score'] = reduce(lambda x, y: x + y, [x['score'] for x in section_paragraphs]) / len(
            section_paragraphs)
        self.full_text[section]['max_score'] = max([x['score'] for x in section_paragraphs])

    def full_text_cleanup(self):
        full_text = {}
        for section in self.full_text:
            full_text[section] = {
                'paragraphs': [{'text': paragraph['text']} for paragraph in self.full_text[section]['paragraphs']]}
        return full_text

    def to_dict(self):
        super_dict = super().to_dict()
        return {**super_dict, **{'full_text': self.full_text}}

    def _db_save(self):
        db_controller.get_collection().update_one({'_id': self.id}, {
            '$set': {'full_text': self.query and self.full_text_cleanup() or self.full_text,
                     'clicks': self.clicks}})

    def db_save(self):
        Thread(target=self._db_save).start()


class FullPMCArticle(FullArticle):
    @retry(stop_max_attempt_number=3, wait_fixed=2000)
    def fetch_tei_article(self):
        logger.info(f"Fetching TEI for PMC document: {self.id}")
        url = f'https://www.ncbi.nlm.nih.gov/pmc/articles/{self.id}/'
        r = s.get(url=url, headers={
            "Content-Type": "application/json"
        }, timeout=5)
        pdf_url_tag = r.html.find('a.int-view', first=True)
        if pdf_url_tag is None:
            raise PDFNotFoundException(self.id)
        pdf_url = 'https://www.ncbi.nlm.nih.gov' + pdf_url_tag.attrs['href']
        if pdf_url is None:
            raise PDFNotFoundException(self.id)
        res = s.get(pdf_url)
        if res.status_code != 200:
            raise PDFDownloadException(self.id)

        try:
            buffer = io.BytesIO(res.content)
        except Exception as e:
            logger.error(f"Error while downloading PMC document: {self.id}")
            logger.exception(e)
            logger.error(res.ContentBuffer)
            raise PDFDownloadException(self.id)
        return self.extract_pdf(buffer)


class SharePointArticle(FullArticle):
    sp_client = SharePointClient()

    def __init__(self, record, query):
        self.path = record['path']
        super().__init__(record, query)

    def fetch_tei_article(self):
        logger.info(f"Downloading SharePoint document: {self.id}")
        sp_file: io.BytesIO = self.sp_client.download_file(self.path)
        logger.success(f"Downloaded SharePoint document: {self.id}")
        logger.info(f"Extracting TEI from SharePoint document: {self.id}")
        return self.extract_pdf(sp_file)
