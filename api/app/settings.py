from pathlib import Path
import os

from pydantic import BaseSettings


class Settings(BaseSettings):
    testing: bool = False
    development: bool = True
    log_path: str = 'logs/'

    # Related searcher settings
    related_search: bool = True
    related_bin_path: str = "index/cord19-hnsw-index/cord19-hnsw.bin"
    related_index_to_uid_path: str = "index/cord19-hnsw-index/cord19-hnsw.txt"
    related_specter_csv_path: str = "index/cord19-hnsw-index/specter.csv"

    # Anserini searcher settings
    index_path: str = 'index/lucene-index-cord19-paragraph'
    schema_path: str = 'schema/cord19.json'
    max_docs: int = 96
    bm25_k1: float = 0.4
    bm25_b: float = 0.9
    rm3: bool = False
    rm3_fb_terms: int = 10
    rm3_fb_docs: int = 10
    rm3_original_query_weight: float = 0.5

    # T5 model settings
    neural_ranking: bool = True
    t5_pretrained_model: str = 'castorini/monot5-base-msmarco-10k'
    t5_batch_size: int = 96
    t5_max_length: int = 256
    t5_device: str = 'cuda:0'
    t5_model_type: str = 't5-base'

    # Paragraph highlighting
    highlight = True
    highlight_model: str = 'monologg/biobert_v1.1_pubmed'
    highlight_max_paragraphs: int = 30
    highlight_device: str = 'cuda:1'

    # Response settings
    max_paragraphs_per_doc = 2

    class Config:
        env_file = '.env'


settings = Settings()
