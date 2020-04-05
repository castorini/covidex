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
    paragraphs: List[str] = []
    abstract: str = None
    journal: str = None
    year: int = None
    publish_time: str = None
    paragraphs: List[str] = []
    highlights: List[List[tuple]] = []
    highlighted_abstract: bool = False

    @validator('highlights')
    def validate_highlights(cls, v, values):
        if v:
            assert len(v) == len(values['paragraphs'])
        return v
