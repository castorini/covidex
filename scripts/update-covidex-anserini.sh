#!/bin/bash

CORD19_INDEX_NAME=lucene-index-cord19-paragraph
CORD19_DATE=$1
COVIDEX_CORD19_INDEX_PATH=api/index/${CORD19_INDEX_NAME}

# Check if date provided
if [ $# -eq 0 ]; then
    echo "USAGE: sh scripts/update-covidex-anserini.sh [DATE=YYYY-MM-DD]"
    exit 1
fi

echo "Updating CORD-19 index for $1..."

python3 -m pip install tqdm # required for indexing script
[ -d anserini ] && echo "Found Anserini folder..." || git clone https://github.com/castorini/anserini.git

cd anserini
git pull && git submodule update --init --recursive
mvn clean package appassembler:assemble -Dmaven.javadoc.skip=true && \
    python3 src/main/python/trec-covid/index_cord19.py --date $CORD19_DATE --all
cd ..

rm -rf $COVIDEX_CORD19_INDEX_PATH
mkdir $COVIDEX_CORD19_INDEX_PATH
mv anserini/indexes/$CORD19_INDEX_NAME-$CORD19_DATE/* $COVIDEX_CORD19_INDEX_PATH/
rm -rf anserini/indexes/*

echo "Successfully updated search indices at api/index/"
