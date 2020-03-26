import json
from typing import Dict, List

import httpx
import numpy as np
import tensorflow as tf
import torch
from fastapi import APIRouter

from app.models import FacetQuery, SearchResultArticle
from app.services.searcher import searcher
from app.settings import settings

router = APIRouter()


async def predict_t5(input):
    async with httpx.AsyncClient() as client:
        response = await client.post('http://localhost:8501/v1/models/t5_model:predict', data=json.dumps({'inputs': input}))
    predictions = np.asarray(json.loads(response.content)['outputs']['scores'])[:, [6136, 1176]]
    log_probs = torch.nn.functional.log_softmax(torch.from_numpy(predictions), dim=1)
    return log_probs[:len(input), 1].tolist()

@router.get('/search', response_model=List[SearchResultArticle])
async def get_search(query: str, facets: List[FacetQuery] = []):
    searcher_hits = searcher.search(query)
    t5_inputs = [f'Query: {query} Document: {hit.contents[:5000]} Relevant:' for hit in searcher_hits]

    # get predictions from T5
    t5_scores = []
    for i in range(0, len(t5_inputs), settings.t5_batch_size):
        pred = await predict_t5(t5_inputs[i:i + settings.t5_batch_size])
        t5_scores.extend(pred)

    # sort results by T5 score
    results = [{'hit': hit, 't5_score': score} for (hit, score) in zip(searcher_hits, t5_scores)]
    results.sort(key=lambda i: i['t5_score'], reverse=True)

    # TODO build search results
    print(results)

    return [SearchResultArticle(title='Test TItle', doi='1.1', authors='Joe')]
