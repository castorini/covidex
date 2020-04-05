"""Script to convert PubMed to Anserini Format."""
import argparse
import gzip
import json
import logging
import multiprocessing
import os
import xml.etree.cElementTree as ET

from functools import partial
from lxml import etree
from tqdm import tqdm
from typing import Any
from typing import Dict
from typing import Tuple


logging.basicConfig(format="%(asctime)s : %(levelname)s : %(message)s",
                    level=logging.INFO)


def stringify(element: etree._Element) -> str:
    """Returns all text from descendants of element as single joined string.

    If element is:
        <aff id="AFF1"><label>1.</label>Neuroscience Research Center</aff>

    Will return:
        '1.Neuroscience Research Center'
    """
    if element is None:
        return ''

    text = ' '.join(element.itertext()).strip()

    # Remove double spacing.
    return ' '.join(text.split())


def build_document(article: Any) -> Dict[str, str]:
    """Convert a PubMed XML article to triples and write them to a file.

    Args:
        article: PubMed XML article.
    """
    doc = {}
    doi = None
    for article_id_item in article.find(
            './/ArticleIdList').findall('ArticleId'):
        id_type = article_id_item.get('IdType')
        # This check should not be necessary, but some .text are None.
        if article_id_item.text is not None:
            article_id_text = article_id_item.text.strip()
            if id_type.lower() == 'pubmed':
                pmid = article_id_text
            elif id_type.lower() == 'doi':
                doi = article_id_text

    doc['id'] = pmid
    doc['source_x'] = 'pubmed'

    if doi:
        doc['doi'] = doi
    else:
        logging.debug(f'PMID not found in article {pmid}')

    # Add title.
    title = stringify(article.find('.//ArticleTitle'))
    if title:
        doc['title'] = title
    else:
        logging.debug(f'Title not found in article {pmid}')

    # Add abstract.
    abstract = stringify(article.find('.//Abstract'))
    if abstract:
        doc['abstract'] = ' '.join(abstract.split())
    else:
        logging.debug(f'Abstract not found in article {pmid}')

    # Find publication date.
    pubdate = article.find('.//PubDate')
    if pubdate is not None:
        issue_date = None
        year = pubdate.find('Year')
        if year is None:
            # If year tag was not found, try MedlineDate tag.
            medlinedate = pubdate.find('MedlineDate')
            if medlinedate is not None:
                issue_date = medlinedate.text
        else:
            issue_date = [year.text]

            month = pubdate.find('Month')
            if month is not None:
                issue_date.append(month.text)

                day = pubdate.find('Day')
                if day is not None:
                    issue_date.append(day.text)

            doc['publish_time'] = '-'.join(issue_date)

    else:
        logging.debug(
            f'Publication date not found in article {pmid}')

    # Find author names.
    author_names = []
    authors_list = article.find('.//AuthorList')
    if authors_list:
        for author_item in authors_list.findall('Author'):
            last_name = author_item.find('LastName')
            if last_name is not None:
                last_name = stringify(last_name)
            else:
                last_name = ''

            fore_name = author_item.find('ForeName')
            if fore_name is not None:
                fore_name = stringify(fore_name)
            else:
                fore_name = ''

            if fore_name or last_name:
                author_names.append((fore_name + ' ' + last_name).strip())

        if author_names:
            doc['authors'] = author_names

    # Find Journal.
    journal = article.find('.//Journal')
    if journal is not None:
        journal_title = journal.find('Title')

        if journal_title is not None:
            doc['journal'] = stringify(journal_title)

        journal_abbreviation = journal.find('.//ISOAbbreviation')
        if journal_abbreviation is not None:
            doc['journal_abbreviation'] = stringify(journal_abbreviation)

    # Get publication type.
    publication_types = article.find('.//PublicationTypeList')
    if publication_types is not None:
        publication_type_meshes = []
        for publication_type in publication_types.findall('PublicationType'):
            publication_type_meshes.append(publication_type.attrib['UI'])
        if publication_type_meshes:
            doc['publication_type_meshes'] = publication_type_meshes

    contents = []
    if 'title' in doc:
        contents.append(doc['title'])

    if 'abstract' in doc:
        contents.append(doc['abstract'])

    contents = ' '.join(contents)

    if not contents:
        contents = 'dummy'

    return {'id': doc['id'], 'raw': doc, 'contents': contents}


def pubmed_to_json(args: Tuple[str]) -> int:
    """Convert a PubMed XML to JSON Lines and save to disk.

    Args:
        args: A tuple containing input_path and output_path.

    Returns:
       doc_count: Number of documents/papers processed.
    """
    input_path, output_path = args

    added_docs = 0

    with gzip.open(input_path, 'rt') as f, open(output_path, 'w') as fout:
        text = f.read()
        tree = ET.ElementTree(ET.fromstring(text))
        root = tree.getroot()

        for article in root.iterfind('PubmedArticle'):
            document = build_document(article=article)
            fout.write(json.dumps(document) + '\n')
            added_docs += 1

    return added_docs


def pubmed_to_json_folder(input_folder: str, output_folder: str,
                          num_processes: int) -> None:
    """Convert PubMed XML files to JSON Lines and save to disk.

    Args:
        input_folder: string. Folder containing PubMed XML files.
        output_folder: string. Folder to save JSON Lines files.
        num_processes: int. Number of processes to read and write multiple
            files in parallel.

    Returns:
       doc_count. int. Number of documents/papers processed.
    """
    input_paths = []
    output_paths = []
    for file_name in os.listdir(input_folder):
        if file_name.endswith('.xml.gz'):
            input_paths.append(os.path.join(input_folder, file_name))
            output_paths.append(os.path.join(
                output_folder, file_name.replace('.xml.gz', '.json')))

    logging.info(f'{len(input_paths)} PubMed files found.')
    logging.info('Converting to JSON Lines...')

    pubmed_to_json_partial = partial(pubmed_to_json)

    pool = multiprocessing.Pool(num_processes)
    for doc_count_partial in tqdm(
            pool.imap_unordered(pubmed_to_json_partial,
                                zip(input_paths, output_paths)),
            total=len(input_paths)):

        if doc_count_partial == 0:
            logging.warn(f'No PubMed documents found.')


if __name__ == '__main__':

    parser = argparse.ArgumentParser(
        description='Converts PubMed abstracts to JSON Lines files.')
    parser.add_argument('--input_folder', required=True,
                        help='File containing PubMed papers.')
    parser.add_argument('--output_folder', required=True,
                        help='output folder to write the JSON Lines files.')
    parser.add_argument(
        '--num_processes', default=None, type=int,
        help='Number of processes to read and write files in parallel.')
    args = parser.parse_args()

    logging.info(args)

    if not os.path.exists(args.output_folder):
        os.makedirs(args.output_folder)

    pubmed_to_json_folder(
        input_folder=args.input_folder,
        output_folder=args.output_folder,
        num_processes=args.num_processes)

    logging.info('Done!')
