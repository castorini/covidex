from typing import Dict, List

from app.models import FacetQuery, SearchResultArticle
from fastapi import APIRouter

router = APIRouter()


@router.get("/search/", response_model=List[SearchResultArticle])
async def get_search(query: str, facets: List[FacetQuery] = []):
    return [SearchResultArticle(title="Test TItle", doi="1.1", authors="Joe")]
