# Index Setup

This describes how to build indexes for the ACL Anthology datasets. All indexes should be placed under the `api/index` folder.

- First, we need to index the Bibtex collection using [Pyserini](https://github.com/castorini/pyserini). [Follow these instructions](https://github.com/castorini/pyserini) to clone and install Pyserini.

- Use this script to clean your bib files before indexing. This script is located in the covidex repository.
    ```bash
    python scripts/aclanthology/cleanup_bibcollection.py \
    --input_path {/path/to/bib_file/}
    --output_path {/path/to/cleaned_bib_file/}
    ```

- After that, We can now index the bibtex docs as a `BibtexCollection` using Pyserini:

    ```bash
    python -m pyserini.index.lucene \
    --collection BibtexCollection \
    --generator BibtexGenerator \
    --threads 8 \
    --input {/path/to/directory_of_cleaned_bib_files/} \
    --index {/path/to/bibtex_indexes} \
    --storePositions --storeDocvectors --storeContents --storeRaw
    ```

The directory `{/path/to/directory_of_cleaned_bib_files/}` should be a directory containing `.bib` files that will be used for search and retrieval.

- Copy the indexed files from `/path/to/bibtex_indexes` folder into `api/index` folder in the covidex repository.
