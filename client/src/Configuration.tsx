/*
  This file provides configuration options for searching different datasets
*/
// Modify this value to load components for another dataset
const DATASET = 'acl';

export const ARTICLE_INFO = 'ArticleInfo';
export const SEARCH_RESULT = 'SearchResult';
export const HOME_TEXT = 'HomeText';
export const METADATA = 'Metadata';

const config = [
  {
    name: ARTICLE_INFO,
    path: `./components/dataset/${DATASET}/ArticleInfo`,
  },
  {
    name: SEARCH_RESULT,
    path: `./components/dataset/${DATASET}/SearchResult`,
  },
  {
    name: HOME_TEXT,
    path: `./components/dataset/${DATASET}/HomeText`,
  },
  {
    name: METADATA,
    path: `./components/dataset/${DATASET}/metadata.json`,
  },
];

type ConfigurationComponents = {
  [key: string]: any;
};

// Dynamically import dataset-specific components
let Configuration: ConfigurationComponents = {};
for (let i = 0; i < config.length; i++) {
  if (config[i].name === METADATA) {
    Configuration[config[i].name] = require('' + config[i].path);
  } else {
    Configuration[config[i].name] = require('' + config[i].path).default;
  }
}

export default Configuration;
