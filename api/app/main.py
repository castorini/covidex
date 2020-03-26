from fastapi import Depends, FastAPI

from app.routers import article, search

app = FastAPI()

app.include_router(article.router, tags=['article'])
app.include_router(search.router, tags=['search'])
