import os

from pyserini.search import pysearch

from app.settings import AnseriniSettings


class Searcher:
    def __init__(self):
        self.settings = AnseriniSettings()
        self.searcher = self.build_searcher()

    def build_searcher(self):
        searcher = pysearch.SimpleSearcher(self.settings.index_path)
        searcher.set_bm25_similarity(self.settings.bm25_k1, self.settings.bm25_b)
        print(f'Initializing BM25, setting k1={self.settings.bm25_k1} and b={self.settings.bm25_b}')
        if self.settings.rm3:
            searcher.set_rm3_reranker(self.settings.rm3_fb_terms,
                                      self.settings.rm3_fb_docs,
                                      self.settings.rm3_original_query_weight)

            print(f'Initializing RM3, setting fbTerms={self.settings.rm3_fb_terms}, '
                    f'fbDocs={self.settings.rm3_fb_docs} and '
                    f'originalQueryWeight={self.settings.rm3_original_query_weight}')
        return searcher

    def search(self, query):
        return self.searcher.search(q=query, k=self.settings.max_docs)

searcher = Searcher()
