import json
from enum import Enum
from typing import List

from pydantic import BaseModel, create_model
from pydantic.class_validators import validator

from app.settings import settings

# Dynamically create model class from schema
if not settings.testing:
    schema = json.load(open(settings.schema_path))
    schema_dict = {
        key: (eval(schema[key]["type"]), eval(schema[key]["default"])) for key in schema
    }
else:
    schema_dict = {}

BaseArticle = create_model("BaseArticle", **schema_dict)


class SearchArticle(BaseArticle):
    score: float
    paragraphs: List[str] = []
    paragraphs: List[str] = []
    highlights: List[List[tuple]] = []
    highlighted_abstract: bool = False
    has_related_articles: bool = False

    @validator("highlights")
    def validate_highlights(cls, v, values):
        if v:
            assert len(v) == len(values["paragraphs"])
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
    query = "query"
    collapsed = "collapsed"
    expanded = "expanded"
    clicked = "clicked"
