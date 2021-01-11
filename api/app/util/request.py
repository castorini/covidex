from typing import List

from fastapi import Request


def get_request_ip(request: Request):
    forwarded_header = "X-Forwarded-For"
    request_ip = request.client.host
    if forwarded_header in request.headers:
        request_ip = request.headers[forwarded_header]

    return request_ip


def get_doc_url(doc) -> str:
    try:
        doi = doc.get("doi")
    except:
        doi = None
    if doi:
        return f"https://doi.org/{doi}"
    return doc.get("url")


def get_multivalued_field(doc, field) -> List[str]:
    return [field.stringValue() for field in doc.getFields(field)]


def populate_article(doc, article_fields, lucene_schema):
    # Add Lucene fields dynamically using a provided Lucene schema
    for field in lucene_schema:
        if lucene_schema[field]["fieldSize"] == "single":
            if field == "url":
                article_fields[field] = get_doc_url(field)
            else:
                article_fields[field] = doc.get(field)
        else:
            article_fields[field] = get_multivalued_field(doc, field)

    return article_fields
