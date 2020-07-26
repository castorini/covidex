from pathlib import Path
import os

from pydantic import BaseSettings


class Settings(BaseSettings):
    testing: bool = False
    development: bool = True
    log_path: str = 'logs/'

    # related searcher stuff
    related_bin_paths: str = "index/cord19-hnsw-index/cord19-hnsw.bin"
    related_index_to_uid_path: str = "index/cord19-hnsw-index/cord19-hnsw.txt"
    related_specter_csv_path: str = "index/cord19-hnsw-index/specter.csv"

    # Anserini searcher settings
    index_path: str = "index/acl"
    schema_path: str = "../schema/acl_schema.json"
    max_docs: int = 96
    bm25_k1: float = 0.4
    bm25_b: float = 0.9
    rm3: bool = False
    rm3_fb_terms: int = 10
    rm3_fb_docs: int = 10
    rm3_original_query_weight: float = 0.5

    # T5 model settings
    t5_model_dir: str = 'gs://neuralresearcher_data/covid/data/model_exp304'
    t5_batch_size: int = 96
    t5_max_length: int = 256
    t5_device: str = 'cuda:0'
    t5_model_type: str = 't5-base'

    # Cache settings
    cache_dir: Path = Path(
        os.getenv('XDG_CACHE_HOME', str(Path.home() / '.cache'))) / 'covidex'
    flush_cache: bool = False

    # Paragraph highlighting
    highlight = True
    highlight_max_paragraphs: int = 30
    highlight_device: str = 'cuda:1'

    # Response settings
    max_paragraphs_per_doc = 2

    class Config:
        env_file = '.env'


settings = Settings()
