# COVID-19 Open Research Dataset Search

This repository contains the API server, neural models, and UI client for [Covidex](https://covidex.ai), a neural search engine for the [COVID-19 Open Research Dataset (CORD-19)](https://pages.semanticscholar.org/coronavirus-research).


## Local Deployment

#### API Server

Download the [latest Anserini index](https://github.com/castorini/anserini/blob/master/docs/experiments-covid.md)
```
sh scripts/update-index.sh
```

Set up environment variables by copying over the defaults and modifying as needed
```
cp .env.sample .env
```

Creating an Anaconda environment for Python 3.7 is highly recommended
```
conda create -n covidex python=3.7
```

Activate the Anaconda environment
```
conda activate covidex
```

Install Python dependencies
```
pip install -r requirements.txt
```

Run the server
```
uvicorn app.main:app --reload --port=8000
```

The server wil be running at [localhost:8000](http://localhost:8000) with API documentation at [/docs](http://localhost:8000/docs)

#### UI Client

Install  [Node.js 12+](https://nodejs.org/en/download/) and [Yarn](https://classic.yarnpkg.com/en/docs/install/).

Install dependencies
```
yarn install
```

Start the server
```
yarn start
```

The client will be running at [localhost:3000](http://localhost:3000)


## Production Deployment

Redirect port 80 to specified port since only root can bind to port 80 (the below command uses port 8000):
```
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8000
```

Download the [latest Anserini index](https://github.com/castorini/anserini/blob/master/docs/experiments-covid.md)
```
sh scripts/update-index.sh
```

Start the server and warm up models (deploys to port 8000 by default):
```
sh scripts/deploy-prod.sh
```

*Optional:* set the environment variable `$PORT`:
```
PORT=8000 sh scripts/deploy-prod.sh
```

Log files are available under `api/logs`, where new files are created daily based on UTC time. All filenames have the date appended except for the current one, which will be named `search.log`.
