# COVID-19 Search API Server

#### Dependencies
- [Anaconda](https://docs.anaconda.com/anaconda/install/) or [Python 3.7+](https://www.python.org/downloads/)

#### Local Deployment

Download the latest Anserini index for the COVID-19 dataset and rename the index as `lucene-index-covid-paragraph/`

```
INDEX_NAME=lucene-index-covid-paragraph-2020-03-20
INDEX_URL=https://www.dropbox.com/s/evnhj2ylo02m03f/lucene-index-covid-paragraph-2020-03-20.tar.gz

wget ${INDEX_URL}
tar xvfz ${INDEX_NAME}.tar.gz && rm ${INDEX_NAME}.tar.gz
mv ${INDEX_NAME} lucene-index-covid-paragraph
```

Set up environment variables by copying over the defaults and modifying as needed

```
cp .env.sample .env
```

Creating an Anaconda environment for Python 3.7 is highly recommended

```
conda create -n covid-search python=3.7
```

Activate the Anaconda environment
```
conda activate covid-search
```

Install Python dependencies

```
pip install -r requirements.txt
```

Run the server

```
uvicorn app.main:app --reload
```
