from app.routers import article, facets, search
from fastapi import FastAPI

app = FastAPI()

app.include_router(article.router, tags=["article"])
app.include_router(facets.router, tags=["facets"])
app.include_router(search.router, tags=["search"])
