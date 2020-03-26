from typing import Dict, List

from fastapi import APIRouter

from app.models import FacetQuery, SearchResultArticle
from app.searcher import searcher

router = APIRouter()


@router.get("/search/", response_model=List[SearchResultArticle])
async def get_search(query: str, facets: List[FacetQuery] = []):
    print(searcher.search(query))
    return [SearchResultArticle(title="Test TItle", doi="1.1", authors="Joe")]
