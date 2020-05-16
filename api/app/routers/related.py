import json
from datetime import datetime
from typing import List
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Request

from app.models import (RelatedArticle, RelatedQueryResponse, SearchLogData,
                        SearchLogType)
from app.settings import settings
from app.util.logging import build_timed_logger
from app.util.request import get_request_ip

router = APIRouter()
related_logger = build_timed_logger('related_logger', 'related.log')


@router.get('/related/{uid}', response_model=RelatedQueryResponse)
async def get_related(request: Request, uid: str, page_number: int = 1, query_id: str = None):
    related_searcher = request.app.state.related_searcher

    # Invalid uid -> 404
    if uid not in related_searcher.index_to_uid:
        raise HTTPException(status_code=404, detail="Item not found")

    source_vector = related_searcher.embedding[uid]
    related_results = []

    # HNSW parameters.
    k = 20 * page_number
    # https://github.com/nmslib/hnswlib/blob/master/ALGO_PARAMS.md
    # ef needs to be between k and dataset.size()
    ef = 2 * k
    related_searcher.HNSW.set_ef(ef)

    # Retrieve documents from HNSW.
    labels, distances = related_searcher.HNSW.knn_query(source_vector, k=k)
    start_idx = (page_number - 1)*20
    end_idx = start_idx + 20
    for index, dist in zip(labels[0][start_idx:end_idx], distances[0][start_idx:end_idx]):
        uid = related_searcher.index_to_uid[index]
        related_results.append({
            'id': uid,
            'abstract': gen_metadata_from_uid(uid, 'abstract'),
            'authors': get_authors_from_uid(uid),
            'distance': str(dist),
            'journal': gen_metadata_from_uid(uid, 'journal'),
            'publish_time': gen_metadata_from_uid(uid, 'publish_time'),
            'source': gen_metadata_from_uid(uid, 'source_x'),
            'title': gen_metadata_from_uid(uid, 'title'),
            'url': gen_metadata_from_uid(uid, 'url'),
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


@router.post('/related/log/clicked', response_model=None)
async def post_clicked(data: SearchLogData):
    related_logger.info(json.dumps({
        'query_id': data.query_id,
        'type': SearchLogType.clicked,
        'result_id': data.result_id,
        'position': data.position,
        'timestamp': datetime.utcnow().isoformat()}))


def gen_metadata_from_uid(uid, field) -> str:
    if uid in related_searcher.metadata:
        item = related_searcher.metadata[uid]
        return item[field]

    return None


def get_authors_from_uid(uid) -> List[str]:
    authors = gen_metadata_from_uid(uid, 'authors')
    if authors is None:
        return []

    return [' '.join(reversed(author.split(', '))).strip() for author in authors.split(';')]
