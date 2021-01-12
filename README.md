# Covidex: A Search Engine for the COVID-19 Open Research Dataset

[![Build Status](https://api.travis-ci.com/castorini/covidex.svg?branch=master)](https://travis-ci.org/castorini/covidex)
[![LICENSE](https://img.shields.io/badge/license-Apache-blue.svg?style=flat)](https://www.apache.org/licenses/LICENSE-2.0)

This repository contains the API server, neural models, and UI client for [Covidex](https://covidex.ai), a neural search engine for the [COVID-19 Open Research Dataset (CORD-19)](https://pages.semanticscholar.org/coronavirus-research). For a description of our system, check out this paper: [Covidex: Neural Ranking Models and Keyword Search Infrastructure for the COVID-19 Open Research Dataset](https://www.aclweb.org/anthology/2020.sdp-1.5/).

We also provide neural search infrastructure for searching domain-specific scholarly literature via [Cydex](https://cydex.ai). This paper details the abstractions developed on top of Covidex to facilitate domain-specific search: [Cydex: Neural Search Infrastructure for the Scholarly Literature](https://www.aclweb.org/anthology/2020.sdp-1.19/).

## Environment Setup

### API Server

1. Install CUDA 10.1

- For Ubuntu, follow [these instructions](https://developer.nvidia.com/cuda-10.1-download-archive-update2)
- For Debian run `sudo apt-get install nvidia-cuda-toolkit`

2. Install [Anaconda](https://docs.anaconda.com/anaconda/install/linux/) (currently version 2020.02)

```
wget https://repo.anaconda.com/archive/Anaconda3-2020.02-Linux-x86_64.sh
bash Anaconda3-2020.02-Linux-x86_64.sh
```

3. Install Java 11 and Maven

```
sudo apt-get install openjdk-11-jre openjdk-11-jdk maven
```

4. Create an Anaconda environment for Python 3.7

```
conda create -n covidex python=3.7
```

5. Activate the Anaconda environment

```
conda activate covidex
```

6. Install Python dependencies from inside `api/`

```
cd api
pip install -r api/requirements.txt
```

7. Setup index and environment variables

   - Build Anserini indices for your dataset. We provide instructions for setting up Covidex with both [CORD-19 and the ACL Anthology](docs/setup-index.md). Instructions to add support for new datasets is found under [docs/adding-datasets.md](docs/adding-datasets.md)

   - Set up environment variables by copying over the defaults from `api/.env.sample` into a new `api/.env` file, and **modifying as needed**. This requires setting the correct index and schema locations, CUDA devices, and enabling/disabling various services (highlighting, related search, neural ranking, etc.). Set `DEVELOPMENT=False` for production deployments.

### UI Client

1. Install [Node.js 14+](https://nodejs.org/en/download/) and [Yarn](https://classic.yarnpkg.com/en/docs/install/).

2. Install dependencies from inside `/client`

```
yarn install
```

## Local Deployment

Serve the UI from inside `/client`. The client will be running at [localhost:3000](http://localhost:3000).

```
yarn start
```

Separately, run the API server from inside `/api`. The server wil be running at [localhost:8000](localhost:8000).

```
uvicorn app.main:app --reload --port=8000
```

## Production deployment

We provide a script under [scripts/deploy-prod.sh](scripts/deploy-prod.sh) to start the API server and serve the UI build files. This assumes the environment is set up correctly and `api/.env` contains `DEVELOPMENT=False`.

Start the server (deploys to port 8000 by default):

```
sh scripts/deploy-prod.sh
```

_Optional:_ set the environment variable `PORT` to use a different port:

```
PORT=8080 sh scripts/deploy-prod.sh
```

Log files are available under `api/logs`. New files are created daily based on UTC time. All filenames have the date appended, except for the current one, which will be named `search.log` or `related.log`.

## Testing

Run all API tests:

```
TESTING=true pytest api
```

## How do I cite this work?

```
@inproceedings{zhang2020covidex,
  title = "Covidex: Neural Ranking Models and Keyword Search Infrastructure for the {COVID}-19 Open Research Dataset",
  author = "Zhang, Edwin  and
    Gupta, Nikhil  and
    Tang, Raphael  and
    Han, Xiao  and
    Pradeep, Ronak  and
    Lu, Kuang  and
    Zhang, Yue  and
    Nogueira, Rodrigo  and
    Cho, Kyunghyun  and
    Fang, Hui  and
    Lin, Jimmy",
  booktitle = "Proceedings of the First Workshop on Scholarly Document Processing",
  month = nov,
  year = "2020",
  address = "Online",
  publisher = "Association for Computational Linguistics",
  url = "https://www.aclweb.org/anthology/2020.sdp-1.5",
  doi = "10.18653/v1/2020.sdp-1.5",
  pages = "31--41",
}
```
