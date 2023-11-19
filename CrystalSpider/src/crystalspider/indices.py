import os
import faiss
from typing import List, Literal
import numpy as np
from faiss import IndexIDMap
from loguru import logger
from db import db_controller
from tools.articles import get_id
from tools.fs import get_path_in_working_dir
from tools.hash import reversible_hash
from tools.vectors import adjust_vector, AdjustmentMode

Metric = Literal["l2", "inner_product"]

class ANNIndex:
    index_path = get_path_in_working_dir("data/faiss_index.faiss")
    TARGET_VECTOR_LENGTH = 384
    index: IndexIDMap

    def __init__(self, metric: Metric = 'l2', rebuild_threshold: int = 100):
        logger.info("Loading ANN Index")
        self.metric: Metric = metric
        self.rebuild_threshold = rebuild_threshold
        self.added_items = 0
        self.load()
        logger.success("Loaded ANN Index")

    def add_item(self, item_id: int, vector: List[float], save_index: bool = True):
        adjusted_vector = adjust_vector(vector, self.TARGET_VECTOR_LENGTH, AdjustmentMode.AUTO)
        # Fix the issue here, pass the adjusted_vector as a 2D numpy array
        self.index.add_with_ids(np.array([adjusted_vector], dtype=np.float32), np.array([item_id], dtype=np.int64))
        if save_index:
            self.save()
        self.added_items += 1
        logger.trace(f"Added item {item_id} to index. Total number of items: {self.added_items}")

    def bulk_add_items(self, items: List[tuple]):
        for item in items:
            self.add_item(item[0], item[1], save_index=False)
        self.save()
        logger.trace(f"Added {len(items)} items to index. Total number of items: {self.added_items}")

    def get_nns_by_vector(self, vector: List[float], n: int = 10):
        logger.debug(f"Getting {n} nearest neighbors for input vector...")
        _, indices = self.index.search(np.array([vector], dtype=np.float32), n)
        return _.tolist()[0], indices.tolist()[0]

    def _build_from_collection(self, collection=None):
        if collection is None:
            collection = db_controller.get_collection()

        articles = collection.find({"vector": {"$exists": True}})
        vectors = []
        ids = []
        for article in articles:
            vec = np.array(article["vector"])
            adjusted_vec = adjust_vector(vec, self.TARGET_VECTOR_LENGTH, AdjustmentMode.AUTO)
            item_id = reversible_hash.encode(get_id(article))
            vectors.append(adjusted_vec)
            ids.append(item_id)

        vectors_np = np.array(vectors, dtype=np.float32)
        ids_np = np.array(ids, dtype=np.int64)

        if self.metric == "l2":
            flat_index = faiss.IndexFlatL2(self.TARGET_VECTOR_LENGTH)
        elif self.metric == "inner_product":
            flat_index = faiss.IndexFlatIP(self.TARGET_VECTOR_LENGTH)
        else:
            raise

        # Wrap the flat index with IndexIDMap to enable add_with_ids method
        self.index = faiss.IndexIDMap(flat_index)

        # Add items to the index
        # Add items to the index using their IDs
        if len(vectors_np) == 0:
            logger.warning("No vectors found in database collection. Index will be empty.")
            return
        # self.index.add_with_ids(vectors_np, ids_np)

    def save(self):
        logger.debug("Saving index...")
        # Ensure the data directory exists
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)

        # Save the index
        faiss.write_index(self.index, self.index_path)

    def load(self):
        logger.debug("Loading index...")
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
        else:
            logger.warning("Index file not found. Index will be built from database collection.")
            self._build_from_collection()
            self.save()
            logger.success("Index built and saved.")