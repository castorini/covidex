import json
import time
from collections import OrderedDict
from typing import List
from uuid import uuid4

import dateparser
from fastapi import APIRouter

from app.models import (Article, SearchLogData, SearchLogType,
                        SearchQueryResponse, SearchVertical)
from app.services.highlighter import highlighter
from app.services.ranker import ranker
from app.services.searcher import searcher
from app.settings import settings
from app.util.logging import build_timed_logger

router = APIRouter()
search_logger = build_timed_logger('search_logger', settings.search_log_path)


@router.get('/search', response_model=SearchQueryResponse)
async def get_search(query: str, vertical: SearchVertical = SearchVertical.cord19):
    # Get search results from Lucene index.
    searcher_hits = searcher.search(query)

    # Only rerank based on paragraph or abstract if original document was retrieved.
    ranked_paragraphs = [hit.contents.split('\n')[-1][:5000] for hit in searcher_hits]
    t5_inputs = [
        f'Query: {query} Document: {p} Relevant:' for p in ranked_paragraphs]

    # Get predictions from T5.
    t5_scores = await ranker.predict_t5(t5_inputs)

    # Sort results by T5 scores.
    results = list(zip(searcher_hits, t5_scores))
    results.sort(key=lambda x: x[1], reverse=True)

    # Group paragraphs from same document by id in sorted order.
    grouped_results = OrderedDict()
    for result in results:
        base_docid = result[0].docid.split('.')[0]
        if base_docid not in grouped_results:
            grouped_results[base_docid] = [result]
        elif len(grouped_results[base_docid]) < settings.max_paragraphs_per_doc:
            # Append paragraph until we reach the configured maximum.
            grouped_results[base_docid].append(result)

    # Take top N paragraphs from each result to highlight and build article object.
    ranked_results = []
    for base_docid, doc_results in grouped_results.items():
        top_hit, top_score = doc_results[0]
        paragraphs = []
        highlighted_abstract = False

        for (hit, score) in doc_results:
            paragraph_number = int(hit.docid.split('.')[-1]) if hit.docid != base_docid else -1
            if paragraph_number == -1:
                highlighted_abstract = True
            paragraphs.append((hit.contents.split('\n')[-1], paragraph_number))

        # Sort top paragraphs by order of appearance in actual text.
        paragraphs.sort(key=lambda x: x[1])
        paragraphs = [text for (text, _) in paragraphs]

        # Add full article to results.
        article = build_article(top_hit, base_docid, top_score, paragraphs, highlighted_abstract)
        ranked_results.append(article)

    if settings.highlight:
        # Highlights the paragraphs.
        highlight_time = time.time()
        paragraphs = []
        for result in ranked_results:
            paragraphs.extend(result.paragraphs)
        paragraphs = paragraphs[:settings.highlight_max_paragraphs]
        all_highlights = highlighter.highlight_paragraphs(query=query, paragraphs=paragraphs)

        # Update results with highlights.
        highlight_idx = 0
        for result in ranked_results:
            num_paragraphs = len(result.paragraphs)
            result.highlights = all_highlights[highlight_idx:highlight_idx+num_paragraphs]
            highlight_idx += num_paragraphs
            if highlight_idx >= len(all_highlights):
                break

        print(f'Time to highlight: {time.time() - highlight_time}')

    # Generate UUID for query.
    query_id = str(uuid4())

    # Log query and results.
    search_logger.info(json.dumps({
        'query_id': query_id,
        'type': SearchLogType.query,
        'vertical': vertical,
        'query': query,
        'response': [r.json() for r in ranked_results]}))

    return SearchQueryResponse(query_id=query_id, response=ranked_results)

@router.post('/search/log/collapsed', response_model=None)
async def post_collapsed(data: SearchLogData):
    search_logger.info(json.dumps({
        'query_id': data.query_id,
        'type': SearchLogType.collapsed,
        'result_id': data.result_id,
        'position': data.position}))

@router.post('/search/log/expanded', response_model=None)
async def post_expanded(data: SearchLogData):
    search_logger.info(json.dumps({
        'query_id': data.query_id,
        'type': SearchLogType.expanded,
        'result_id': data.result_id,
        'position': data.position}))

@router.post('/search/log/clicked', response_model=None)
async def post_clicked(data: SearchLogData):
    search_logger.info(json.dumps({
        'query_id': data.query_id,
        'type': SearchLogType.clicked,
        'result_id ': data.result_id,
        'position': data.position}))

def build_article(hit, id: str, score: float, paragraphs: List[str], highlighted_abstract: bool):
    doc = hit.lucene_document
    return Article(id=id,
                   title=doc.get('title'),
                   doi=doc.get('doi'),
                   source=doc.get('source_x'),
                   authors=[field.stringValue() for field in doc.getFields('authors')],
                   abstract=doc.get('abstract'),
                   journal=doc.get('journal'),
                   year=dateparser.parse(doc.get('publish_time')).year if doc.get('year') else None,
                   url=doc.get('url') if doc.get('url') else 'https://www.semanticscholar.org/',
                   publish_time=doc.get('publish_time'),
                   score=score,
                   paragraphs=paragraphs,
                   highlighted_abstract=highlighted_abstract)
