#!/bin/bash

echo "Updating Anserini index..."

CORD19_INDEX_NAME=lucene-index-covid-paragraph
CORD19_INDEX_DATE=2020-04-10
CORD19_INDEX_URL=https://www.dropbox.com/s/ivk87journyajw3/lucene-index-covid-paragraph-2020-04-10.tar.gz

TRIALSTREAMER_INDEX_NAME=lucene-index-trialstreamer
TRIALSTREAMER_INDEX_DATE=2020-04-14
TRIALSTREAMER_INDEX_URL=https://www.dropbox.com/s/mvtxpo4u5n5k65f/lucene-index-trialstreamer-2020-04-14.tar.gz

echo "Updating CORD-19 index..."
wget ${CORD19_INDEX_URL}
rm -rf api/index/${CORD19_INDEX_NAME}
mkdir api/index/${CORD19_INDEX_NAME}
tar xvfz ${CORD19_INDEX_NAME}-${CORD19_INDEX_DATE}.tar.gz \
    -C api/index/${CORD19_INDEX_NAME} --strip-components 1
rm ${CORD19_INDEX_NAME}-${CORD19_INDEX_DATE}.tar.gz

echo "Updating Trialstreamer index..."
wget ${TRIALSTREAMER_INDEX_URL}
rm -rf api/index/${TRIALSTREAMER_INDEX_NAME}
mkdir api/index/${TRIALSTREAMER_INDEX_NAME}
tar xvfz ${TRIALSTREAMER_INDEX_NAME}-${TRIALSTREAMER_INDEX_DATE}.tar.gz \
    -C api/index/${TRIALSTREAMER_INDEX_NAME} --strip-components 1
rm ${TRIALSTREAMER_INDEX_NAME}-${TRIALSTREAMER_INDEX_DATE}.tar.gz

echo "Successfully updated Anserini indices at api/index/"
