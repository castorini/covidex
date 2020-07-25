from typing import List
import json

from pydantic import BaseModel, create_model
from pydantic.class_validators import validator
from enum import Enum


def gettype(name):
    t = getattr(__builtins__, name)
    if isinstance(t, type):
        return t
    raise ValueError(name)


lucene_schema = json.load(open("../lucene_schema.json"))
schema_dict = {key: (eval(lucene_schema[key]["type"]), eval(lucene_schema[key]["default"])) for key in lucene_schema}

BaseArticle = create_model("BaseArticle", **schema_dict)

class SearchArticle(BaseArticle):
    score: float
    paragraphs: List[str] = []
    paragraphs: List[str] = []
    highlights: List[List[tuple]] = []
    highlighted_abstract: bool = False
    has_related_articles: bool = False

    @validator('highlights')
    def validate_highlights(cls, v, values):
        if v:
            assert len(v) == len(values['paragraphs'])
        return v


class RelatedArticle(BaseArticle):
    distance: float


class SearchQueryResponse(BaseModel):
    query_id: str
    response: List[SearchArticle]


class RelatedQueryResponse(BaseModel):
    query_id: str
    response: List[RelatedArticle]


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
