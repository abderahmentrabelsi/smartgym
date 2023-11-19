from __future__ import annotations

import io
import os
import requests
from typing import Any
from bs4 import BeautifulSoup
from grobid_client import Client
from grobid_client.models import ProcessForm
from grobid_client.types import File, Response
from loguru import logger


def _try_or_none(func):
    try:
        return func()
    except Exception as e:
        logger.exception(e)
        return None


class GrobidClient:
    grobidClient: Client

    def __init__(self):
        logger.debug("Initializing GrobidClient")
        self.grobidClient = Client(base_url=os.environ.get('GROBID_BASE_URL'), verify_ssl=False, timeout=60)

    def extract_pdf_headers(self, buffer: io.BytesIO) -> dict[str, list[str] | Any] | None:
        logger.debug("Extracting PDF headers")
        logger.trace("Sending request to Grobid")
        payload = ProcessForm(
            input_=File(file_name="dummy", payload=buffer, mime_type="application/pdf"),
            consolidate_header="1"
        ).to_multipart()

        http_response = requests.post(
            verify=self.grobidClient.verify_ssl,
            url=f'{self.grobidClient.base_url}/processHeaderDocument',
            cookies=self.grobidClient.get_cookies(),
            timeout=self.grobidClient.get_timeout(),
            files=payload,
        )
        grobid_response = Response(
            status_code=http_response.status_code,
            content=http_response.content,
            headers=http_response.headers,
            parsed=None
        )
        logger.trace("Got Grobid response.")
        if grobid_response.status_code != 200:
            logger.error(
                f"Grobid returned status code {grobid_response.status_code} with content {grobid_response.content}")
            return None
        """
        We need to parse the TEI ourselves because the grobid_client throws a KeyError over "MD5"
        This exception is thrown in grobid_client/models/tei.py:line 169 when consolidate_header is set to 1
        We need consolidate_header in order to get publication date and DOI. 
        
        it used to be this: # doc = TEI.parse(grobid_response.content)
        """

        logger.debug("Parsing TEI")
        soup = BeautifulSoup(grobid_response.content, features="xml")
        abstract = _try_or_none(lambda: soup.find('abstract').getText().strip())
        # keywords = self._try_or_none([kw.text.strip() for kw in soup.find('keywords').find_all('term')])
        title = _try_or_none(lambda: soup.find('titleStmt').find('title').getText().strip())

        authors = _try_or_none(lambda: [" ".join(a.stripped_strings) for a in
                                        soup.find('sourceDesc').find('biblStruct').find('analytic')
                               .find_all('author') if a.find('persName')])

        try:
            pubdate = soup.find('publicationStmt').find('date').getText().strip().split('-')
            year = pubdate[0] if len(pubdate) > 0 else None
            month = pubdate[1] if len(pubdate) > 1 else None
            day = pubdate[2] if len(pubdate) > 2 else None

            if year is None:
                return None
            pubdate = {
                'year': year,
                'month': month,
                'day': day
            }

        except Exception as e:
            logger.error("Failed to parse publication date. Aborting extraction.")
            return None

        logger.debug("PDF headers extracted")
        return {
            "title": title,
            "authors": authors,
            "abstract": abstract,
            # "keywords": keywords,
            "pubdate": pubdate
        }
