from app.settings import settings
import hnswlib
import csv


class RelatedHelper:
    def __init__(self):
        # Variables
        self.DIM = None
        self.HNSW = None
        self.TOTAL_NUM_ELEMENTS = None
        self.metadata = {}
        self.embedding = {}
        self.index_to_uid = []

        # Initialization Procedures
        self.loadIndexToUidFile()
        self.loadMetadataCSV()
        self.loadEmbeddingCSV()
        self.loadHNSW()

    def loadHNSW(self):
        print('>> [RelatedHelper] hnswlib indexing')
        self.HNSW = hnswlib.Index(space='l2', dim=self.DIM)
        self.HNSW.load_index(settings.related_bin_path,
                             max_elements=self.TOTAL_NUM_ELEMENTS)
        self.HNSW.set_ef(50)
        print('<< [RelatedHelper] done')

    def loadIndexToUidFile(self):
        res = []

        with open(settings.related_index_to_uid_path, 'r') as f:
            for line in f:
                parsed_line = line.strip().split(' ')
                i, uid = parsed_line
                res.append(uid)

        self.index_to_uid = res
        self.TOTAL_NUM_ELEMENTS = len(res)
        print(
            f'>> [RelatedHelper] Detected {self.TOTAL_NUM_ELEMENTS} elements')

    def loadMetadataCSV(self):
        res = {}
        headers = None

        with open(settings.related_metadata_csv_path, newline='') as csvfile:
            reader = csv.reader(csvfile, delimiter=',', quotechar='"')
            for row in reader:
                if headers is None:
                    headers = row
                    continue

                item = {}
                uid = row[0]
                for index, token in enumerate(row):
                    if index != 0:
                        item[headers[index]] = token

                res[uid] = item

        self.metadata = res
        print('>> [RelatedHelper] Loaded Metadata CSV')

    def loadEmbeddingCSV(self):
        res = {}
        vectorDimension = None

        with open(settings.related_specter_csv_path, newline='') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            for row in reader:
                uid = row[0]
                vector = row[1:]
                res[uid] = vector

                if vectorDimension is None:
                    vectorDimension = len(vector)
                else:
                    assert vectorDimension == len(
                        vector), "[RelatedHelper] Embedding Dimension Mismatch"

        self.embedding = res
        self.DIM = vectorDimension
        print('>> [RelatedHelper] Loaded Embedding CSV')
        print(f'>> [RelatedHelper] Embedding dimension -> {self.DIM}')


relatedHelper = RelatedHelper()
