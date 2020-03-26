# COVID-19 Open Research Dataset Search

This repository contains the API server and UI client for searching the [COVID-19 Open Research Dataset (CORD-19)](https://pages.semanticscholar.org/coronavirus-research).

#### Local Deployment

To run the API server, follow the instructions in [api/README.md](./api/README.md)
To run the UI client, follow the instructions in [client/README.md](./client/README.md)

#### Setting up T5

Install [`nvidia-docker`](https://github.com/nvidia/nvidia-docker/wiki/Installation-(Native-GPU-Support))

Run the T5 model with [TensorFlow Serving](https://www.tensorflow.org/tfx/serving/docker) and the NVidia Docker runtime

```
docker run --runtime=nvidia -e NVIDIA_VISIBLE_DEVICES=0 \
    -e MODEL_NAME=t5_model -p 8501:8501 \
    -t tensorflow/serving:nightly-gpu \
    --port=8500 --rest_api_port=8501 \
    --model_base_path=gs://neuralresearcher_data/covid/data/model_exp304/export/
```

The model can be called from [localhost:8501](http://localhost:8501) using the [TensorFlow Serving REST API](https://www.tensorflow.org/tfx/serving/api_rest)