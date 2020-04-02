## Create index

```

INPUT_DIR=$SCRATCH/covid/data/precision_medicine/corpus_2019
OUTPUT_DIR=$SCRATCH/covid/data/precision_medicine/anserini_format

gsutil cp gs://neuralresearcher_data/precision_medicine/pubmed_2019.tar.gz $INPUT_DIR

python convert_pubmed_to_anserini.py  \
     --input_folder=${INPUT_DIR} \
     --output_folder=$OUTPUT_DIR  \
     --num_processes=4
```



## Evaluate
First, start the server

```
cd api
cp .env.sample .env
echo -e '\nMAX_DOCS=1000' >> .env
echo -e 'T5_MODEL_DIR=./model/1585070383' >> .env
echo -e 'HIGHLIGHT=False' >> .env
echo -e 'HIGHLIGHT_DEVICE=cpu' >> .env
echo -e 'INDEX_PATH=/scratch/rfn216/covid/data/precision_medicine/corpus_2019' >> .env

conda activate covid-search

gcloud auth login --no-launch-browser
cloud config set project neuralresearch
mkdir model
gsutil cp -r gs://neural-covidex/data/t5_base/export/1585070383 ./model/
module load cudnn/10.1v7.6.5.32
module load cuda/10.1.105
module load jdk/11.0.4
uvicorn app.main:app --reload --port=8000 &
```

```
python search.py  \
    --url=http://127.0.0.1:8000/api/search  \
    --topics=./data/topics2019.xml  \
    --output_run=./run.txt

$HOME/anserini/eval/trec_eval.9.0.4/trec_eval \
  -m all_trec \
  ./data/qrels-treceval-abstracts.2019.txt \
  ./run.txt
```
