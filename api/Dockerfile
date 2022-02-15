FROM ubuntu:20.04

RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:openjdk-r/ppa && \
    apt-get update && \
    apt-get install -y openjdk-11-jdk && \
    apt-get install -y openjdk-11-jre

RUN apt-get install -y --no-install-recommends  git

WORKDIR /server
COPY . /server/


RUN apt update && apt install -y python3-pip
RUN pip3 install --upgrade pip setuptools

RUN pip3 install --pre torch torchvision torchaudio -f https://download.pytorch.org/whl/nightly/cpu/torch_nightly.html
RUN pip3 install faiss-cpu hnswlib
RUN pip3 install hnswlib

RUN pip3 install --upgrade pip && pip3 install -r requirements.txt
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
ENV DEVELOPMENT=True

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]