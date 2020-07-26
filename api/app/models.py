from typing import List
import json

from pydantic import BaseModel, create_model
from pydantic.class_validators import validator
from enum import Enum
from app.settings import settings

schema = json.load(open(settings.schema_path))
lucene_schema = schema["document_fields"]
verticals = schema["SearchVertical"]

schema_dict = {key: (eval(lucene_schema[key]["type"]), eval(lucene_schema[key]["default"])) for key in lucene_schema}

BaseArticle = create_model("BaseArticle", **schema_dict)
SearchVertical = Enum("SearchVertical", [(vertical, verticals[vertical]) for vertical in verticals], type=str)


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
