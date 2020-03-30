import time
from typing import List

import dateparser
from fastapi import APIRouter

from app.models import Article
from app.services.highlighter import highlighter
from app.services.ranker import ranker
from app.services.searcher import searcher
from app.settings import settings

router = APIRouter()


@router.get('/search', response_model=List[Article])
async def get_search(query: str):
    searcher_hits = searcher.search(query)
    t5_inputs = [
        f'Query: {query} Document: {hit.contents[:5000]} Relevant:'
        for hit in searcher_hits]

    # Get predictions from T5.
    t5_scores = await ranker.predict_t5(t5_inputs)

    # Build results.
    results = [
        build_base_article(hit, score)
        for (hit, score) in zip(searcher_hits, t5_scores)]

    # Sort by T5 scores.
    results.sort(key=lambda x: x.score, reverse=True)

    # Remove paragraphs from same document.
    seen_docid = set()
    deduped_results = []
    for result in results:
        original_docid = result.id.split('.')[0]
        if original_docid not in seen_docid:
            deduped_results.append(result)
        seen_docid.add(original_docid)

    if settings.highlight:
        # Highlights the paragraphs.
        highlight_time = time.time()
        paragraphs = [
            result.paragraphs[0]
            for result in deduped_results[:settings.highlight_max_paragraphs]]

        new_paragraphs, all_highlights = highlighter.highlight_paragraphs(
            query=query, paragraphs=paragraphs)
        for result, new_paragraph, highlights in zip(
                deduped_results, new_paragraphs, all_highlights):
            # Only one paragraph per document is highlighted for now.
            result.paragraphs = [new_paragraph]
            result.highlights = [highlights]

        print(f'Time to highlight: {time.time() - highlight_time}')

    return deduped_results

def build_base_article(hit, score):
    doc = hit.lucene_document
    contents = hit.contents.split('\n')[-1]
    return Article(id=hit.docid,
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
                   paragraphs=[contents[-1]],
                   highlighted_abstract=contents[-1] == doc.get('abstract'))
