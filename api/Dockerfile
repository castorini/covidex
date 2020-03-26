FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

# Install Java 11 for Pyserini
RUN echo 'deb http://ftp.debian.org/debian stretch-backports main' | tee /etc/apt/sources.list.d/stretch-backports.list
RUN apt update
RUN apt install openjdk-11-jdk -y

# Install Python dependencies
COPY requirements.txt /app
RUN pip install -r requirements.txt

COPY $INDEX_PATH /app
COPY ./app /app
