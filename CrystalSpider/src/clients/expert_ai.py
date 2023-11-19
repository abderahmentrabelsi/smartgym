import hashlib
from loguru import logger
from common.caching import cache
from expertai.nlapi.cloud.client import ExpertAiClient
from expertai.nlapi.common.authentication import ExpertAiAuth

from common.memoization import memoize_call


class ExpertAiProcessor:
    expertAiClient = ExpertAiClient()

    def __init__(self):
        ExpertAiAuth().fetch_token_value()

    @memoize_call
    def get_main_sentences(self, paragraph: str) -> list[dict]:
        res = self.specific_resource_analysis(paragraph)
        main_sentences = [{'start': main_sentence.start, 'end': main_sentence.end} for main_sentence in
                          res.main_sentences][:3]
        logger.debug(f"Main sentences retrieved for paragraph {paragraph[:50]}")
        return main_sentences

    @memoize_call
    def specific_resource_analysis(self, paragraph: str) -> list[dict]:
        return self.expertAiClient.specific_resource_analysis(
            body={"document": {"text": paragraph}},
            params={'language': 'en', 'resource': 'relevants'}
        )
