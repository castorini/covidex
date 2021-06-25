from typing import List

from pyserini.search import SimpleSearcher

from app.settings import settings


class Searcher:
    def __init__(self):
        self.build_searcher(settings.index_path)

    def build_searcher(self, index_path):
        self.searcher = SimpleSearcher(index_path)
        self.searcher.set_bm25(settings.bm25_k1, settings.bm25_b)
        print(
            f"Initializing BM25 {index_path}, "
            f"setting k1={settings.bm25_k1} and b={settings.bm25_b}"
        )
        if settings.rm3:
            self.searcher.set_rm3(
                settings.rm3_fb_terms,
                settings.rm3_fb_docs,
                settings.rm3_original_query_weight,
            )

            print(
                "Initializing RM3, setting "
                f"fbTerms={settings.rm3_fb_terms}, "
                f"fbDocs={settings.rm3_fb_docs} and "
                f"originalQueryWeight={settings.rm3_original_query_weight}"
            )

    def search(self, query: str):
        return self.searcher.search(q=query, k=settings.max_docs)

    def doc(self, id: str):
        return self.searcher.doc(id)
