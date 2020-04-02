"""Script to evaluate search engine on Precision Medicine qrels."""
import argparse
import collections
import logging
import requests
import xml.etree.cElementTree as ET

from tqdm import tqdm
from typing import Dict


def search(query, url):
    params = {'query': query}
    response = requests.get(url=url, params=params).json()

    return response


def load_queries(path: str) -> Dict[str, str]:
    queries = collections.OrderedDict()
    with open(path) as f:
        text = f.read()
        tree = ET.ElementTree(ET.fromstring(text))
        root = tree.getroot()
        for topic in root:
            query_id = topic.attrib['number']

            disease = topic.find('.//disease').text
            gene = topic.find('.//gene').text
            demographic = topic.find('.//demographic').text
            query = ' '.join([disease, gene, demographic])

            queries[query_id] = query

    # TREC_EVAL expects topics to be sorted.
    queries = {
        str(query_id): queries[str(query_id)]
        for query_id in sorted(map(int, queries.keys()))}

    return queries


if __name__ == '__main__':

    parser = argparse.ArgumentParser(
        description='Evaluate search engine on Precision Medicine qrels.')
    parser.add_argument('--url', required=True, help='Url of the search API')
    parser.add_argument('--topics', required=True,
                        help='Topics file (queries)')
    parser.add_argument('--output_run', required=True,
                        help='Path to write the run file')
    args = parser.parse_args()

    logging.info(args)

    queries = load_queries(args.topics)

    print(f'Loaded {len(queries)} queries.')
    with open(args.output_run, 'w') as fout:
        for query_id, query in tqdm(queries.items(), total=len(queries)):
            results = search(query, url=args.url)
            for rank, result in enumerate(results):
                doc_id = result['id']
                fout.write(
                    f'{query_id} Q0 {doc_id} {rank + 1} {1 / (rank + 1)} '
                    'RUN1\n')

    print('Done')
