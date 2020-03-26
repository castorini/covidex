FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

# Instal Java 11 for Pyserini
RUN echo 'deb http://ftp.debian.org/debian stretch-backports main' | tee /etc/apt/sources.list.d/stretch-backports.list
RUN apt update
RUN apt install openjdk-11-jdk -y

# Download Anserini index
#RUN wget $INDEX_URL
#RUN tar xvfz $INDEX_FILE

COPY requirements.txt /app
RUN pip install -r requirements.txt

COPY ./app /app

COPY lucene-index-covid-2020-03-20/ /app