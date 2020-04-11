import logging
import time
from logging.handlers import TimedRotatingFileHandler

import pkg_resources


def build_timed_logger(name: str, path: str) -> logging.Logger:
    '''
    Returns a logger that creates appends a new log file daily
    '''
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # Remove default log handlers
    for handler in logger.handlers:
        logger.removeHandler(handler)

    abs_path = pkg_resources.resource_filename(__name__, path)
    handler = TimedRotatingFileHandler(path, when="d", interval=1, utc=True)
    logger.addHandler(handler)
    return logger
