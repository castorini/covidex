import json
from datetime import datetime
from typing import List
from uuid import uuid4

from fastapi import APIRouter, Request, HTTPException
from app.models import (RelatedArticle, RelatedQueryResponse)
from app.settings import settings
from app.util.logging import build_timed_logger
from app.util.request import get_request_ip
from app.services.related_searcher import related_searcher


router = APIRouter()
related_logger = build_timed_logger(
    'related_logger', settings.related_log_path)


@router.get('/related/{uid}', response_model=RelatedQueryResponse)
async def get_related(request: Request, uid: str, page_number: int = 1):
    # Invalid uid -> 404
    if uid not in related_searcher.index_to_uid:
        raise HTTPException(status_code=404, detail="Item not found")

    source_vector = related_searcher.embedding[uid]
    related_results = []
    k = 20 * page_number
    # https://github.com/nmslib/hnswlib/blob/master/ALGO_PARAMS.md
    # ef needs to be between k and dataset.size()
    ef = 2 * k
    related_searcher.HNSW.set_ef(ef)
    print(f"Querying {k} docs from [{uid}]")
    labels, distances = related_searcher.HNSW.knn_query(source_vector, k=k)
    for index, dist in zip(labels[0], distances[0]):
        uid = related_searcher.index_to_uid[index]

        related_results.append({
            'distance': str(dist),
            'id': uid,
            'url': gen_metadata_from_uid(uid, 'url'),
            'source': gen_metadata_from_uid(uid, 'source_x'),
            'title': gen_metadata_from_uid(uid, 'title'),
            'authors': get_authors_from_uid(uid),
            'journal': gen_metadata_from_uid(uid, 'journal'),
            'publish_time': gen_metadata_from_uid(uid, 'publish_time'),
            'abstract': gen_metadata_from_uid(uid, 'abstract'),
        })

    # Generate UUID for query.
    query_id = str(uuid4())

    # Log query and results.
    related_logger.info(json.dumps({
        'query_id': query_id,
        'uid': uid,
        'page_number': page_number,
        'request_ip': get_request_ip(request),
        'timestamp': datetime.utcnow().isoformat(),
        'response': related_results,
    }))

    return RelatedQueryResponse(query_id=query_id, response=related_results)


def gen_metadata_from_uid(uid, field) -> str:
    if uid in related_searcher.metadata:
        item = related_searcher.metadata[uid]
        return item[field]

    return None


def get_authors_from_uid(uid) -> List[str]:
    authors = gen_metadata_from_uid(uid, 'authors')
    if authors is None:
        return []

    return [author.strip() for author in authors.split(';')]
