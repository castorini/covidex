# Index Setup

This describes how to build indexes for the CORD-19 and ACL Anthology datasets. All indexes should be placed under the `api/index` folder.

## CORD-19

We provide two scripts under `scripts/` to directly build indexes for specific releases of the CORD-19 dataset. For all of our deployments, we use paragraph-level indexing. We also provide a script to process Allen AI's SPECTER paper embeddings for CORD-19 and index them using HNSW for our related article functionality.

1. Build Lucene index for search

   ```
   sh scripts/update-covidex-anserini.sh [DATE=YYYY-MM-DD]
   ```

2. Build HNSW index for related article search

   ```
   sh scripts/update-covidex-hnsw.sh
   ```

Alternatively, instructions to download pre-built Lucene indexes and more details can be found under the [Anserini documentation](https://github.com/castorini/anserini/blob/master/docs/experiments-cord19.md).

## ACL Anthology

1. Generate ACL Anthology YAML data by following the `Generating ACL Anthology Data` section from the [Anserini documentation](https://github.com/castorini/anserini/blob/master/docs/acl-anthology.md).

2. Index the data into Lucene with Anserini (modify the paths to point to the correct location)

_Note that this requires Anserini to be cloned and built correctly (see https://github.com/castorini/anserini)_

```
sh target/appassembler/bin/IndexCollection \
  -collection AclAnthology -generator AclAnthologyGenerator \
  -threads 8 \-input path/to/acl/build/data -index path/to/api/index \
  -storePositions -storeDocvectors -storeContents -storeRaw -optimize
```
