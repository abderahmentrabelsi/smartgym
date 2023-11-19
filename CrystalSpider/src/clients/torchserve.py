import os
from typing import List, Dict

import numpy as np
import requests
from loguru import logger
from common.memoization import memoize_call


class HostedModelsClient:
    @staticmethod
    @memoize_call
    def rank_paragraphs(query: str, paragraphs_list: list[str]):
        logger.info(f"Requesting ranked paragraphs for {len(paragraphs_list)} paragraphs")
        try:
            response = requests.post(
                f"{os.environ.get('TORCHSERVE_BASE_URL')}/predictions/retrieve_and_rank",
                json={
                    "method": "rank_paragraphs",
                    "input": {
                        "query": query,
                        "paragraphs": paragraphs_list,
                        "top_k": len(paragraphs_list)
                    }
                }
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Error fetching ranked paragraphs: {e}")
            raise

    @staticmethod
    @memoize_call
    def generate_embeddings(paragraphs_list: list[str]):
        logger.info(f"Requesting embeddings for {len(paragraphs_list)} paragraphs")
        try:
            response = requests.post(
                f"{os.environ.get('TORCHSERVE_BASE_URL')}/predictions/retrieve_and_rank",
                json={
                    "method": "generate_embeddings",
                    "input": {
                        "paragraphs": paragraphs_list
                    }
                }
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Error fetching embeddings: {e}")
            raise

    @staticmethod
    @memoize_call
    def score_paragraphs(query: str, paragraphs_list: List[str]) -> List[Dict[str, float]]:
        logger.info(f"Requesting paragraph scores for {len(paragraphs_list)} paragraphs")
        try:
            response = requests.post(
                f"{os.environ.get('TORCHSERVE_BASE_URL')}/predictions/retrieve_and_rank",
                json={
                    "method": "score_paragraphs",
                    "input": {
                        "query": query,
                        "paragraphs": paragraphs_list
                    }
                }
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Error fetching paragraph scores: {e}")
            raise

    @staticmethod
    def min_max_normalize(scores):
        min_score = min(scores)
        max_score = max(scores)
        normalized_scores = [(score - min_score) / (max_score - min_score) for score in scores]
        return normalized_scores

    @staticmethod
    def normalized_paragraph_scores(query: str, paragraphs_list: List[str]) -> List[Dict[str, float]]:
        scores = HostedModelsClient.score_paragraphs(query, paragraphs_list)
        score_values = [score["score"] for score in scores]
        print(score_values)
        normalized_scores = HostedModelsClient.min_max_normalize(np.array(score_values))
        return [{"paragraph": score["paragraph"], "score": normalized_score} for score, normalized_score in zip(scores, normalized_scores)]

