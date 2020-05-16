import csv
from typing import Dict, Set

import hnswlib

from app.settings import settings


class RelatedSearcher:
    def __init__(self):
        self.dim = None
        self.hnsw = None
        self.num_elements: int = None

        self.embedding: Dict = {}
        self.index_to_uid: Dict[int, str] = {}
        self.uid_set: Set[str] = set()

        # Load index files
        self.load_index_to_uid()
        self.load_specter_embedding()
        self.load_hnsw()

    def load_index_to_uid(self):
        with open(settings.related_index_to_uid_path, 'r') as f:
            for line in f:
                parsed_line = line.strip().split(' ')
                i, uid = parsed_line
                self.index_to_uid[int(i)] = uid
                self.uid_set.add(uid)

        self.num_elements = len(self.index_to_uid)
        print(f'[RelatedSearcher] Loaded {self.num_elements} elements')

    def load_specter_embedding(self):
        res = {}
        dim = None
        print('[RelatedSearcher] Loading SPECTER embeddings')
        with open(settings.related_specter_csv_path, newline='') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            for row in reader:
                uid = row[0]
                vector = row[1:]
                res[uid] = vector

                if dim is None:
                    dim = len(vector)
                else:
                    assert dim == len(
                        vector), "[RelatedSearcher] Embedding dimension mismatch"

        self.embedding = res
        self.dim = dim

    def load_hnsw(self):
        self.hnsw = hnswlib.Index(space='l2', dim=self.dim)
        self.hnsw.load_index(settings.related_bin_path,
                             max_elements=self.num_elements)
        self.hnsw.set_ef(50)
        print('[RelatedSearcher] Loaded HNSW')
