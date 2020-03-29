import dateparser
import time

from fastapi import APIRouter
from app.models import Article, QueryFacet
from app.services.highlighter import highlighter
from app.services.ranker import ranker
from app.services.searcher import searcher
from app.settings import settings
from typing import List


router = APIRouter()


@router.get('/search', response_model=List[Article])
async def get_search(query: str, facets: List[QueryFacet] = []):
    searcher_hits = searcher.search(query)
    t5_inputs = [
        f'Query: {query} Document: {hit.contents[:5000]} Relevant:'
        for hit in searcher_hits]

    # Get predictions from T5.
    t5_scores = await ranker.predict_t5(t5_inputs)

    # Build results.
    results = [
        build_article(hit, score)
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

    # Highlights the paragraphs.
    highlight_time = time.time()
    paragraphs = [
        result.paragraphs[0]
        for result in deduped_results[:settings.highlight_max]]

    all_highlights = highlighter.highlight_paragraphs(
        query=query, paragraphs=paragraphs)

    for result, highlights in zip(deduped_results, all_highlights):
        # Only one paragraph per document is highlighted for now.
        result.highlights = [highlights]
        print('result.highlights', result.highlights)
    print(f'Time to highlight: {time.time() - highlight_time}')

    return deduped_results


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
                   doi=doc.get('doi'),
                   source=doc.get('source_x'),
                   authors=authors,
                   abstract=doc.get('abstract'),
                   journal=doc.get('journal'),
                   year=year,
                   publish_time=publish_time,
                   url=url,
                   score=score,
                   paragraphs=[hit.contents])


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
        return pubmed_url + doc.get('pubmed_id')
    elif doc.get('sha'):
        return s2_url + doc.get('sha').split(';')[-1].strip()
    else:
        return s2_url
