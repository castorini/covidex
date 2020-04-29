from uuid import uuid4
import json
from fastapi import APIRouter, Request, HTTPException
from app.models import (RelatedArticle, RelatedQueryResponse)
from app.settings import settings
from app.util.logging import build_timed_logger
from app.services.relatedHelper import relatedHelper
from datetime import datetime

router = APIRouter()
related_logger = build_timed_logger(
    'related_logger', settings.related_log_path)


@router.get('/related/{uid}', response_model=RelatedQueryResponse)
async def get_related(request: Request, uid: str, pageNumber: int = 1):
    # Invalid uid -> 404
    if uid not in relatedHelper.index_to_uid:
        raise HTTPException(status_code=404, detail="Item not found")

    source_vector = relatedHelper.embedding[uid]
    related_results = []
    k = 20 * pageNumber
    # https://github.com/nmslib/hnswlib/blob/master/ALGO_PARAMS.md
    # ef needs to be between k and dataset.size()
    ef = 2 * k
    relatedHelper.HNSW.set_ef(ef)
    print(f"Querying {k} docs from [{uid}]")
    labels, distances = relatedHelper.HNSW.knn_query(source_vector, k=k)
    for index, dist in zip(labels[0], distances[0]):
        uid = relatedHelper.index_to_uid[index]

        related_results.append({
            'distance': str(dist),
            'uid': uid,
            'url': gen_metadata_from_uid(uid, 'url'),
            'title': gen_metadata_from_uid(uid, 'title'),
            'authors': gen_metadata_from_uid(uid, 'authors'),
            'journal': gen_metadata_from_uid(uid, 'journal'),
            'publish_time': gen_metadata_from_uid(uid, 'publish_time'),
            'abstract': gen_metadata_from_uid(uid, 'abstract'),
        })

    # Generate UUID for query.
    query_id = str(uuid4())

    # Log query and results.
    forwarded_header = 'X-Forwarded-For'
    request_ip = request.client.host
    if forwarded_header in request.headers:
        request_ip = request.headers[forwarded_header]

    related_logger.info(json.dumps({
        'query_id': query_id,
        'uid': uid,
        'pageNumber': pageNumber,
        'request_ip': request_ip,
        'timestamp': datetime.utcnow().isoformat(),
        'response': related_results,
    }))

    return RelatedQueryResponse(query_id=query_id, response=related_results)


def gen_metadata_from_uid(uid, field):
    if uid in relatedHelper.metadata:
        item = relatedHelper.metadata[uid]
        return item[field]

    return None
