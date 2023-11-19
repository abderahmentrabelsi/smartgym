import os
import pickle

from tools.fs import get_path_in_working_dir


class _ReversibleHash:
    hash_table_file = get_path_in_working_dir("data/hash_table.pkl")

    def __init__(self):
        self.hash_table = self._load_hash_table()

    def encode(self, string):
        index = len(self.hash_table)
        if string not in self.hash_table.values():
            self.hash_table[index] = string
            self._save_hash_table()
            return index
        else:
            return self.get_index(string)

    def get_index(self, string):
        for index, value in self.hash_table.items():
            if value == string:
                return index
        raise ValueError("String not found in hash table")

    def has_index(self, index):
        return index in self.hash_table.values()

    def decode(self, index):
        if index in self.hash_table:
            return self.hash_table[index]
        else:
            raise ValueError("Index not found in hash table")

    def _load_hash_table(self):
        if os.path.exists(self.hash_table_file):
            with open(self.hash_table_file, "rb") as f:
                return pickle.load(f)
        else:
            return {}

    def _save_hash_table(self):
        os.makedirs(os.path.dirname(self.hash_table_file), exist_ok=True)
        with open(self.hash_table_file, "wb") as f:
            pickle.dump(self.hash_table, f)


def _reversible_hash():
    return _ReversibleHash()


reversible_hash = _reversible_hash()
