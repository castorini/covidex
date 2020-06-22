# COVID-19 Open Research Dataset Search

[![Build Status](https://api.travis-ci.com/castorini/covidex.svg?branch=master)](https://travis-ci.org/castorini/covidex)
[![LICENSE](https://img.shields.io/badge/license-Apache-blue.svg?style=flat)](https://www.apache.org/licenses/LICENSE-2.0)

This repository contains the API server, neural models, and UI client for [Covidex](https://covidex.ai), a neural search engine for the [COVID-19 Open Research Dataset (CORD-19)](https://pages.semanticscholar.org/coronavirus-research).


## Local Deployment

#### API Server

Install CUDA 10.1
+ For Ubuntu, follow [these instructions](https://developer.nvidia.com/cuda-10.1-download-archive-update2)
+ For Debian run `sudo apt-get install nvidia-cuda-toolkit`

Install [Anaconda](https://docs.anaconda.com/anaconda/install/linux/) (currently version 2020.02)
```
wget https://repo.anaconda.com/archive/Anaconda3-2020.02-Linux-x86_64.sh
bash Anaconda3-2020.02-Linux-x86_64.sh
```

Install Java 11
```
sudo apt-get install openjdk-11-jre openjdk-11-jdk
```

Build the [latest Anserini indices](https://github.com/castorini/anserini/blob/master/docs/experiments-cord19.md)
```
sh scripts/update-anserini.sh
```

Build the latest HNSW index
```
sh scripts/update-hnsw.sh
```

Set up environment variables by copying over the defaults and modifying as needed
```
cp api/.env.sample api/.env
```

Create an Anaconda environment for Python 3.7
```
conda create -n covidex python=3.7
```

Activate the Anaconda environment
```
conda activate covidex
```

Install Python dependencies
```
pip install -r api/requirements.txt
```

Run the server (make sure you are in the `api/` folder)
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

Build the [latest Anserini indices](https://github.com/castorini/anserini/blob/master/docs/experiments-cord19.md)
```
sh scripts/update-anserini.sh [DATE]
```

Build the latest HNSW index
```
sh scripts/update-hnsw.sh
```

Start the server (deploys to port 8000 by default):
```
sh scripts/deploy-prod.sh
```

*Optional:* set the environment variable `$PORT`:
```
PORT=8000 sh scripts/deploy-prod.sh
```

Log files are available under `api/logs`, where new files are created daily based on UTC time. All filenames have the date appended except for the current one, which will be named `search.log` or `related.log`.


## Testing

To run all API tests
```
TESTING=true pytest api
```
