#!/bin/bash

echo "Updating Anserini index..."

INDEX_NAME=lucene-index-covid-paragraph-2020-04-03
INDEX_URL=https://www.dropbox.com/s/rfzxrrstwlck4wh/lucene-index-covid-paragraph-2020-04-03.tar.gz

wget ${INDEX_URL}
tar xvfz ${INDEX_NAME}.tar.gz && rm ${INDEX_NAME}.tar.gz

rm -rf api/lucene-index-covid-paragraph
mv ${INDEX_NAME} api/lucene-index-covid-paragraph

echo "Successfully updated Anserini index at api/${INDEX_NAME}"
