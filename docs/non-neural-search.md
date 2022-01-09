# BM25 Bibtex Search

[![Build Status](https://api.travis-ci.com/castorini/covidex.svg?branch=master)](https://travis-ci.org/castorini/covidex)
[![LICENSE](https://img.shields.io/badge/license-Apache-blue.svg?style=flat)](https://www.apache.org/licenses/LICENSE-2.0)

This page documents the steps to create a [Cydex Instance](http://cydex.ai) for searching scholarly articles locally from a collection of bibtex records without neural re-ranking.

## Indexing 

- First, we need to index the Bibtex collection using [Anserini](https://github.com/castorini/anserini). [Follow these instructions](https://github.com/castorini/anserini#getting-started) to clone and build Anserini.


- After cloning, We can now index the bibtex docs as a `BibtexCollection` using Anserini:

    ```bash
    sh target/appassembler/bin/IndexCollection \
    -collection BibtexCollection -generator BibtexGenerator \
    -threads 8 -input {/path/to/bib_files/} \
    -index {/path/to/bibtex_indexes} \
    -storePositions -storeDocvectors -storeContents -storeRaw
    ```

The directory `/path/to/bib_files/` should be a directory containing `.bib` files that will be used for search and retrieval

For additional details, see explanation of [common indexing options](https://github.com/castorini/anserini/blob/master/docs/common-indexing-options.md).

- Copy the indexed files from `/path/to/bibtex_indexes` folder into `api/index` folder in the covidex repository

## Local Deployment

### API Server


- Install [Anaconda](https://docs.anaconda.com/anaconda/install) (currently version 2020.02)

- Set up environment variables by copying over the defaults and modifying as needed
  ```
  cp api/.env.sample api/.env
  ```

#### Update Environment Variables
Open the `.env` file and change the following environment variables according to your needs

- Set the `T5_DEVICE` variable from cuda to cpu if you are not working on a GPU.
- Set `NEURAL_RANKING` to false for BM25 search with no neural re-ranking. 
- You can define a custom schema for your dataset using the fields in the bib files and update the `SCHEMA_PATH` variable. e.g [schema/acl.json](schema/acl.json)
- Set `RELATED_SEARCH` variable to `False` for BM25 search
- You can disable text span highlighter according to your needs by setting `HIGHLIGHT` to `False` or `True`

#### Run App
- Create an Anaconda environment for Python 3.7
  ```
  conda create -n covidex python=3.7
  ```

- Activate the Anaconda environment
  ```
  conda activate covidex
  ```

- Install Python dependencies
  ```
  pip install -r api/requirements.txt
  ```

- Run the server (make sure you are in the `api/` folder)
  ```
  uvicorn app.main:app --reload --port=8000
  ```

- The server wil be running at [localhost:8000](http://localhost:8000) with API documentation at [/docs](http://localhost:8000/docs)
you can test the api by running the command below;

  ```
  curl --request GET --url 'http://localhost:8000/api/search?query={query}'
  ```


### UI Client

- Start another terminal session and install  [Node.js 12+](https://nodejs.org/en/download/) and [Yarn](https://classic.yarnpkg.com/en/docs/install/).

- Depending on the fields in your dataset, you can either write a custom UI renderer for the search results or use an existing one e.g [client/src/components/dataset/cord19](client/src/components/dataset/cord19)

- Update the client config file `client/src/Configuration.tsx` with the name of the dataset.

- Install dependencies (make sure you are in the `client/` folder)
  ```
  yarn install
  ```

- Start the server
  ```
  yarn start
  ```

- The client will be running at [localhost:3000](http://localhost:3000)




## Testing

- To run all API tests
  ```
  TESTING=true pytest api
  ```
