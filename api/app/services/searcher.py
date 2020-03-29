from pyserini.search import pysearch
from app.settings import settings


class Searcher:
    def __init__(self):
        self.searcher = self.build_searcher()

    def build_searcher(self):
        searcher = pysearch.SimpleSearcher(settings.index_path)
        searcher.set_bm25_similarity(settings.bm25_k1, settings.bm25_b)
        print('Initializing BM25, setting '
              f'k1={settings.bm25_k1} and b={settings.bm25_b}')
        if settings.rm3:
            searcher.set_rm3_reranker(settings.rm3_fb_terms,
                                      settings.rm3_fb_docs,
                                      settings.rm3_original_query_weight)

            print('Initializing RM3, setting '
                  f'fbTerms={settings.rm3_fb_terms}, '
                  f'fbDocs={settings.rm3_fb_docs} and '
                  f'originalQueryWeight={settings.rm3_original_query_weight}')
        return searcher

    def search(self, query):
        return self.searcher.search(q=query, k=settings.max_docs)


searcher = Searcher()
