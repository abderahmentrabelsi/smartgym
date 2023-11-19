import json
import logging
import os

import torch
from sentence_transformers import SentenceTransformer, CrossEncoder
from typing import List, Dict, Union
from ts.torch_handler.base_handler import BaseHandler

logger = logging.getLogger(__name__)


class RetrieveAndRerankHandlerHttp(BaseHandler):
    def __init__(self):
        super().__init__()
        self.bi_encoder = None
        self.cross_encoder = None
        self.mapping = {
            "rank_paragraphs": self.rank_paragraphs,
            "generate_embeddings": self.generate_embeddings,
            "score_paragraphs": self.score_paragraphs
        }
        self.initialized = False

    def initialize(self, ctx):
        properties = ctx.system_properties
        model_dir = properties.get("model_dir")

        self.bi_encoder = SentenceTransformer(
            os.path.join(model_dir, 'sentence-transformers', 'paraphrase-distilroberta-base-v1'), device='cpu')
        self.cross_encoder = CrossEncoder(os.path.join(model_dir, 'cross-encoder', 'ms-marco-MiniLM-L-6-v2'),
                                          device='cpu')

        self.bi_encoder.to(self.device)
        self.bi_encoder.max_seq_length = 512
        self.bi_encoder.share_memory()
        self.bi_encoder.eval()
        self.initialized = True

    def preprocess(self, data):
        json_input = data[0]["body"]
        logger.info("[Preprocess - JSON INPUT ]: {}".format(json_input))
        return json_input

    def inference(self, data):
        method = data["method"]
        input_data = data["input"]
        logger.info("[Inference - METHOD]: {}".format(method))
        logger.info("[Inference - INPUT ]: {}".format(input_data))
        return self.mapping[method](**input_data)

    def postprocess(self, data):
        data = data if isinstance(data, list) else [data]
        logger.info("[Postprocess - [DATA] ]: {}".format(data))
        return data

    def rank_paragraphs(self, query: str, paragraphs: List[str], top_k: int = 5) -> List[Dict[str, Union[str, float]]]:
        logger.info("[Rank Paragraphs - QUERY ]: {}".format(query))
        logger.info("[Rank Paragraphs - PARAGRAPHS ]: {}".format(paragraphs))
        logger.info("[Rank Paragraphs - TOP K ]: {}".format(top_k))
        # Step 1: Retrieve - Use the bi-encoder to compute paragraph embeddings and sort by similarity
        query_embedding = self.bi_encoder.encode(query)
        paragraph_embeddings = self.bi_encoder.encode(paragraphs)
        scores = torch.nn.functional.cosine_similarity(torch.Tensor([query_embedding]),
                                                       torch.Tensor(paragraph_embeddings)).tolist()
        sorted_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)

        # Step 2: Re-Rank - Use the cross-encoder to re-rank the top_k paragraphs
        top_k_indices = sorted_indices[:top_k]
        top_k_paragraphs = [paragraphs[i] for i in top_k_indices]
        cross_encoder_input = [[query, p] for p in top_k_paragraphs]
        cross_encoder_scores = [float(x) for x in self.cross_encoder.predict(cross_encoder_input)]

        reranked_results = [{"paragraph": top_k_indices[i], "score": cross_encoder_scores[i]} for i in
                            range(len(top_k_paragraphs))]
        reranked_results.sort(key=lambda x: x["score"], reverse=True)

        logger.info("[Rank Paragraphs - SORTED INDICES ]: {}".format(sorted_indices))
        logger.info("[Rank Paragraphs - TOP K INDICES ]: {}".format(top_k_indices))
        logger.info("[Rank Paragraphs - TOP K PARAGRAPHS ]: {}".format(top_k_paragraphs))
        logger.info("[Rank Paragraphs - CROSS-ENCODER INPUT ]: {}".format(cross_encoder_input))
        logger.info("[Rank Paragraphs - CROSS-ENCODER SCORES ]: {}".format(cross_encoder_scores))
        logger.info("[Rank Paragraphs - RERANKED RESULTS ]: {}".format(reranked_results))

        return reranked_results

    def generate_embeddings(self, paragraphs: List[str]) -> List[List[float]]:
        logger.info("[Generate Embeddings - PARAGRAPHS ]: {}".format(paragraphs))
        embeddings = [[float(y) for y in self.bi_encoder.encode(x)] for x in paragraphs]
        logger.info("[Generate Embeddings - EMBEDDINGS ]: {}".format(len(embeddings)))
        return embeddings

    def score_paragraphs(self, query: str, paragraphs: List[str]) -> list[dict[str, int | float]]:
        logger.info("[Score Paragraphs - QUERY ]: {}".format(query))
        logger.info("[Score Paragraphs - PARAGRAPHS ]: {}".format(paragraphs))
        cross_encoder_input = [[query, p] for p in paragraphs]
        scores = self.cross_encoder.predict(cross_encoder_input)
        logger.info("[Score Paragraphs - CROSS-ENCODER INPUT ]: {}".format(cross_encoder_input))
        logger.info("[Score Paragraphs - SCORES ]: {}".format(scores.tolist()))
        return [{"paragraph": index, "score": float(score)} for index, score in enumerate(scores.tolist())]



_handler = RetrieveAndRerankHandlerHttp()


def handle(data, context):
    try:
        if not _handler.initialized:
            _handler.initialize(context)

        if data is None:
            return None

        preprocess_output = _handler.preprocess(data)
        inference_output = _handler.inference(preprocess_output)
        postprocessed_data = _handler.postprocess(inference_output)

        logger.info(f"Postprocessed data: {postprocessed_data}")

        retval = [postprocessed_data]
        return retval
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        raise e
