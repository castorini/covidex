from fastapi import APIRouter

from app.models import Article

router = APIRouter()


@router.get("/article/{id}", response_model=Article)
async def get_article(id: int):
    return Article(id=id, title="Full Article", doi="1.1", authors="Joe")
