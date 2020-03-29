from typing import List

from pydantic import BaseModel
from pydantic.class_validators import validator


class Article(BaseModel):
    id: str
    title: str
    doi: str
    source: str
    url: str
    score: float
    authors: List[str] = []
    abstract: str = None
    journal: str = None
    year: str = None
    publish_time: str = None
    paragraphs: List[str] = []
    highlights: List[List[tuple]] = []

    @validator('highlights')
    def highlights_(cls, v, values):
        assert len(v) == len(values['paragraphs'])
        return v
class QueryFacet(BaseModel):
    name: str
    values: List[str]
