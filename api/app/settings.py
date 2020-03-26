from pydantic import BaseSettings


class APISettings(BaseSettings):
    cors: str = ""

class AnseriniSettings(BaseSettings):
    # Anserini searcher settings
    index_path: str
    max_docs: int = 96
    bm25_k1: float = 0.4
    bm25_b: float = 0.9
    rm3: bool = False
    rm3_fb_terms: int = 10
    rm3_fb_docs: int = 10
    rm3_original_query_weight: float = 0.5
