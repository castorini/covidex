# COVID-19 Open Research Dataset Search

#### Local Installation

Download the latest Anserini index for the COVID-19 dataset and move it into the `api/app/` directory
```
wget https://www.dropbox.com/s/evnhj2ylo02m03f/lucene-index-covid-paragraph-2020-03-20.tar.gz
tar xvfz lucene-index-covid-paragraph-2020-03-20.tar.gz
rm lucene-index-covid-paragraph-2020-03-20.tar.gz
mv lucene-index-covid-paragraph-2020-03-20 api/app/
```

Set up environment variables by copying over the defaults

```
cp .env.sample .env
```

**IMPORTANT:** Update the INDEX_PATH in `.env` with the the name of the index downloaded in the previous step as `/app/INDEX_DIRECTORY`

Build and run containers for server and client

```
docker-compose up --build -d
```

----

The client will be running at [http://localhost:3000](http://localhost:3000)

The API server will be running at [http://localhost:8000](http://localhost:8000) with documentation available at [/docs](http://localhost:8080/docs#/)

----