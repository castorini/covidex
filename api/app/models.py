from typing import List

from pydantic import BaseModel
from pydantic.class_validators import validator
from enum import Enum


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


class SearchQueryResponse(BaseModel):
    query_id: str
    response: List[Article]


class SearchLogData(BaseModel):
    query_id: str
    result_id: str
    position: int


class SearchLogType(str, Enum):
    query = 'query'
    collapsed = 'collapsed'
    expanded = 'expanded'
    clicked = 'clicked'


class SearchVertical(str, Enum):
    cord19 = 'cord19'
    trialstreamer = 'trialstreamer'


class RelatedArticle(BaseModel):
    distance: str
    uid: str
    url: str
    title: str
    authors: str = None
    journal: str = None
    publish_time: str = None
    abstract: str = None


class RelatedQueryResponse(BaseModel):
    query_id: str
    response: List[RelatedArticle]
