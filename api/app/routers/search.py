import json
from typing import Dict, List

import dateparser
import httpx
import numpy as np
import tensorflow as tf
import torch
from fastapi import APIRouter

from app.models import Article, QueryFacet
from app.services.searcher import searcher
from app.settings import settings

router = APIRouter()

@router.get('/search', response_model=List[Article])
async def get_search(query: str, facets: List[QueryFacet] = []):
    searcher_hits = searcher.search(query)
    t5_inputs = [f'Query: {query} Document: {hit.contents[:5000]} Relevant:' for hit in searcher_hits]

    # get predictions from T5
    t5_scores = []
    for i in range(0, len(t5_inputs), settings.t5_batch_size):
        pred = await predict_t5(t5_inputs[i:i + settings.t5_batch_size])
        t5_scores.extend(pred)

    # build results and sort by T5 score
    results = [build_article(hit, score) for (hit, score) in zip(searcher_hits, t5_scores)]
    results.sort(key=lambda x: x.score, reverse=True)

    # remove paragraphs from same document
    seen_docid = set()
    deduped_results = []
    for result in results:
        original_docid = result.id.split('.')[0]
        if original_docid not in seen_docid:
            deduped_results.append(result)
        seen_docid.add(original_docid)

    return deduped_results

async def predict_t5(input):
    async with httpx.AsyncClient() as client:
        response = await client.post('http://localhost:8501/v1/models/t5_model:predict', data=json.dumps({'inputs': input}))
    predictions = np.asarray(json.loads(response.content)['outputs']['scores'])[:, [6136, 1176]]
    log_probs = torch.nn.functional.log_softmax(torch.from_numpy(predictions), dim=1)
    return log_probs[:len(input), 1].tolist()

def build_article(hit, score):
    doc = hit.lucene_document
    authors = [field.stringValue() for field in doc.getFields('authors')]
    url = build_url(doc)

    publish_time = doc.get('publish_time')
    try:
        year = dateparser.parse(publish_time).year
    except:
        year = None

    return Article(id=hit.docid, title=doc.get('title'),
                   doi=doc.get('doi'), source=doc.get('source_x'),
                   authors=authors, abstract=doc.get('abstract'),
                   journal=doc.get('journal'), year=year,
                   publish_time=publish_time, url=url, score=score)

def build_url(doc):
    doi_url = ' https://doi.org/'
    pmc_url = 'https://www.ncbi.nlm.nih.gov/pmc/articles/'
    pubmed_url = 'https://www.ncbi.nlm.nih.gov/pubmed/'
    s2_url = 'https://www.semanticscholar.org/paper/'

    if doc.get('doi'):
      return doi_url + doc.get('doi')
    elif doc.get('pmcid'):
      return pmc_url + doc.get('pmcid')
    elif doc.get('pubmed_id'):
      return pmc_url + doc.get('pubmed_id')
    elif doc.get('sha'):
      return s2_url + doc.get('sha').split(';')[-1].strip()
    else:
      return s2_url
