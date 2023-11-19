import faiss
import os
import numpy as np
from typing import List, Tuple
import pickle

from db import db_controller
from tools.fs import get_path_in_working_dir
from tools.hash import reversible_hash


class FaissIndexWrapper:
    data_path = get_path_in_working_dir("data/")
    dim = 768

    def __init__(self):
        self.dim = self.dim
        self.data_path = self.data_path
        self.index_file = os.path.join(self.data_path, 'faiss_index.bin')

        if os.path.exists(self.index_file):
            self._deserialize()
        else:
            self.index = faiss.IndexIDMap(faiss.IndexFlatL2(self.dim))
            self._serialize()

    def add_item(self, id: str, vector: List[float]):
        faiss_id = reversible_hash.encode(id)
        self.index.add_with_ids(np.array([vector], dtype=np.float32), np.array([faiss_id]))
        self._serialize()

    def bulk_add_items(self, items: List[Tuple[str, List[float]]]):
        vectors = [item[1] for item in items]
        ids = [reversible_hash.encode(item[0]) for item in items]
        self.index.add_with_ids(np.array(vectors, dtype=np.float32), np.array(ids))
        self._serialize()

    def get_similar_by_id(self, id: str, k: int = 10):
        collection = db_controller.get_collection()
        article = collection.find_one({"_id": id})
        if not article or "vector" not in article:
            raise ValueError(f"Article not found or has no vector: {id}")
        vector = article["vector"]
        faiss_id = reversible_hash.encode(id)
        distances, top_indices = self.index.search(np.array([vector], dtype=np.float32), k)
        similar_items = [
            (reversible_hash.decode(index), float(distance))
            for index, distance in zip(top_indices[0], distances[0])
            if index != faiss_id
        ]
        return similar_items

    def _serialize(self):
        if not os.path.exists(self.data_path):
            os.makedirs(self.data_path)

        faiss.write_index(self.index, self.index_file)

    def _deserialize(self):
        self.index = faiss.read_index(self.index_file)