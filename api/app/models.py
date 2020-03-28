from typing import List

from pydantic import BaseModel


class Article(BaseModel):
    id: str
    title: str
    doi: str
    source: str
    url: str
    score: float
    authors: List[str] = []
    paragraphs: List[str] = []
    abstract: str = None
    journal: str = None
    year: int = None
    publish_time: str = None

class QueryFacet(BaseModel):
    name: str
    values: List[str]
