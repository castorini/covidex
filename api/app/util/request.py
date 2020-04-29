from fastapi import Request


def get_request_ip(request: Request):
    forwarded_header = 'X-Forwarded-For'
    request_ip = request.client.host
    if forwarded_header in request.headers:
        request_ip = request.headers[forwarded_header]

    return request_ip
