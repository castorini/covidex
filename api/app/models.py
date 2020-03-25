from typing import List

from pydantic import BaseModel


class Article(BaseModel):
    id: int
    title: str
    doi: str
    authors: str
    abstract: str = None
    journal: str = None
    url: str = None
    full_text_paragraphs: List[str] = []

class Facet(BaseModel):
    name: str
    page: int
    values: List[str] = []

class FacetQuery(BaseModel):
    name: str
    values: List[str]

class SearchResultArticle(BaseModel):
    title: str
    doi: str
    authors: str
    abstract: str = None
    journal: str = None
