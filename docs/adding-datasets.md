# Adding New Datasets

To deploy Covidex using a new dataset, you will need to provide a Lucene schema for the API server, and also provide a set of UI components to render search results.

## API Server

1. Create a new Lucene index for your dataset and place it under the `api/index` folder

2. Add a new Lucene index schema for the API under `api/schema`

3. Modify `api/.env` to point to the new index and schema

## UI Components

To provide new UI components, add a new folder for your dataset under `client/src/components/dataset/`, mirroring what is already provided for `cord19` and `acl`.

In each dataset folder, the following components need to be provided:

1. `ArticleInfo.tsx`

   A component that describes how to display key information for each article such as the title, author, source, etc. This component should be rendered inside `SearchResult.tsx`.

2. `SearchResult.tsx`

   This component renders each search result using the `ArticleInfo` component and any extra components such as highlighted text or abstracts.

3. `HomeText.tsx`

   This is the component that should render on the home page.

4. `metadata.json`

   This JSON file provides metadata about the client such as the title, description, favicon, and search filters. Each value that is in the existing `metadata.json` files must be provided.

Finally, inside `Configuration.tsx`, change the `DATASET` variable to be the name of the folder containing your new components.
