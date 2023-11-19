from llama_index.data_structs import Node
from llama_index.data_structs.node_v2 import DocumentRelationship

from db import db_controller
from loguru import logger

from tools.articles import get_id


class ArticleTransformer:
    @staticmethod
    def get_documents_with_full_text():
        logger.debug("Getting documents with full text...")
        documents = list(db_controller.get_collection().find({
            'full_text': {'$exists': True}
        }))
        logger.debug(f"Found {len(documents)} documents with full text")
        return documents

    @staticmethod
    def restructure_paragraphs(document) -> dict[str, list[str]]:
        logger.debug(f"Restructuring paragraphs for document {get_id(document)}...")
        paragraphs = document['full_text']
        new_paragraphs = dict()
        for key, value in paragraphs.items():
            cleaned: list[str] = [block['text'] for block in value['paragraphs']]
            cleaned.insert(0, str(key))
            new_paragraphs[key] = cleaned
        logger.debug(f"Paragraphs restructured for document {get_id(document)}")
        return new_paragraphs

    @staticmethod
    def _get_flat_array(document) -> list[str]:
        logger.debug(f"Flattening array for document {get_id(document)}...")
        paragraphs = document['full_text']
        raw = []
        for key, value in paragraphs.items():
            out = str(key) + "\n"
            for block in value['paragraphs']:
                out += block['text']
            raw.append(out)
        logger.debug(f"Array flattened for document {get_id(document)}")
        return raw

    @staticmethod
    def get_raw_text(document) -> str:
        logger.debug(f"Getting raw text for document {get_id(document)}...")
        raw_text = "\n".join(ArticleTransformer._get_flat_array(document))
        logger.debug(f"Raw text retrieved for document {get_id(document)}")
        return raw_text

    @staticmethod
    def paragraphs_to_nodes(document):
        logger.debug(f"Converting paragraphs to nodes for document {get_id(document)}...")
        nodes = [Node(text=paragraph, relationships={
            DocumentRelationship.SOURCE: get_id(document)
        }) for paragraph in ArticleTransformer._get_flat_array(document)]
        for i in range(len(nodes) - 1):
            nodes[i].relationships[DocumentRelationship.NEXT] = nodes[i + 1].get_doc_id()
            nodes[i + 1].relationships[DocumentRelationship.PREVIOUS] = nodes[i].get_doc_id()
        logger.debug(f"Paragraphs converted to nodes for document {get_id(document)}")
        return nodes
