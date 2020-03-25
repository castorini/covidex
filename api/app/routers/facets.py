from typing import List

from app.models import Facet
from fastapi import APIRouter

router = APIRouter()


@router.get("/facets/", response_model=List[Facet])
async def get_all_facets(page_size: int = 10):
    facet = Facet(name="test", page=1)
    return [facet]

@router.get("/facets/{facet_name}", response_model=Facet)
async def get_facets(facet_name, page: int = 1, page_size: int = 10):
    return Facet(name=facet_name, page=page)
