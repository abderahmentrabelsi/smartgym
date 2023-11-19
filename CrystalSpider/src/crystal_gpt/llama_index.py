import os
from llama_index import GPTSimpleVectorIndex, ServiceContext, QueryMode, IndexStructType

from classes.Article import Article
from crystal_gpt.mongo_adapter import ArticleTransformer
from llama_index import GPTListIndex
from llama_index.indices.composability import ComposableGraph
from common.caching import cache
from loguru import logger

from tools.articles import get_id
from tools.fs import get_path_in_working_dir

agent_chain = None


class IndexCacheManager:
    @staticmethod
    def get_index(index_id) -> GPTSimpleVectorIndex | None:
        path = get_path_in_working_dir(f'data/index_{index_id}.json')
        if os.path.exists(path):
            logger.debug(f"Loading index from disk: {path}")
            return GPTSimpleVectorIndex.load_from_disk(path)
        return None

    @staticmethod
    def save_index(index_id: str, index: GPTSimpleVectorIndex):
        logger.debug(f"Saving index to disk: index_{index_id}.json")
        index.save_to_disk(get_path_in_working_dir(f'data/index_{index_id}.json'))


class LlamaIndexManager:
    service_context = ServiceContext.from_defaults(chunk_size_limit=512)
    idx_set: dict[str, GPTSimpleVectorIndex] = {}
    documents: list[Article] = []
    graph: ComposableGraph = None
    graph_file_path = get_path_in_working_dir('data/graph.json')

    def __init__(self):
        cache.flush()
        self._build_index()
        self._compose_graph()

    def add_article(self, article: Article):
        logger.info(f"Adding new article with ID {get_id(article)}...")
        self.documents.append(article)
        index = self._get_document_index(article)
        self.idx_set[get_id(article)] = index
        logger.success(f"Article added, updating composable graph...")
        self.graph = self._create_or_update_composable_graph(self.documents, self.idx_set)
        self.graph.save_to_disk(self.graph_file_path)
        logger.success("Composable graph updated")

    @classmethod
    def _build_index(cls):
        logger.info("Building index...")
        cls.documents = ArticleTransformer.get_documents_with_full_text()
        cls.idx_set = cls._load_and_update_indices(cls.documents)
        logger.success("Index built containing {} indices".format(len(cls.idx_set)))

    def _compose_graph(self):
        logger.info("Composing graph...")
        self.graph = self._create_or_update_composable_graph(self.documents, self.idx_set)
        self.graph.save_to_disk(self.graph_file_path)
        logger.success("Graph composed and saved to disk")

    @classmethod
    def _load_and_update_indices(cls, documents):
        logger.info("Loading and updating indices...")
        indices = {}
        for document in documents:
            indices[get_id(document)] = cls._get_document_index(document)
        logger.success("Indices loaded and updated")
        return indices

    @classmethod
    def _get_document_index(cls, document):
        index_id = get_id(document)
        logger.info(f"Indexing document {index_id}...")
        index = IndexCacheManager.get_index(index_id)
        if index is None:
            logger.debug(f"Creating new index for document {index_id}")
            nodes = ArticleTransformer.paragraphs_to_nodes(document)
            index = GPTSimpleVectorIndex(nodes)
            IndexCacheManager.save_index(index_id, index)
        else:
            logger.info(f"Loaded index from disk for document {index_id}")
        return index

    def _create_or_update_composable_graph(self, documents, index_set):
        logger.debug("Creating or updating composable graph...")
        if os.path.exists(self.graph_file_path):
            logger.debug("Loading graph from disk...")
            graph = ComposableGraph.load_from_disk(self.graph_file_path)
        else:
            logger.debug("Creating new composable graph...")
            graph = self._create_composable_graph(documents, index_set)

        docs_in_graph = [
            list(list(x.to_dict().values())[1]['doc_id_dict'].items())[0][0]
            for x
            in list(graph.index_struct.all_index_structs.values())
            if x.get_type() == IndexStructType.SIMPLE_DICT
        ]

        missing_indices = [x for x in documents if get_id(x) not in docs_in_graph]
        if missing_indices:
            logger.info(f"Recreating graph with {len(documents)} missing indices...")
            graph = self._create_composable_graph(documents, index_set)
        return graph

    def _create_composable_graph(self, documents, index_set):
        logger.debug("Creating composable graph...")
        return ComposableGraph.from_indices(
            GPTListIndex,
            children_indices=[index_set[get_id(y)] for y in documents],
            index_summaries=[doc['abstract'] for doc in documents],
            service_context=self.service_context,
        )

