import { STOP_WORDS } from './Constants';

/* Tokenize words based on stopwords and split by common punctuation */
export const tokenize = (text: string): Array<string> => {
  let results: Array<string> = [];
  let words = text
    .toLowerCase()
    .replace('-', ' ')
    .replace('.', ' ')
    .replace(',', ' ')
    .replace('?', ' ')
    .split(' ');

  words.forEach((word) => {
    if (!STOP_WORDS.has(word)) {
      results.push(word);
    }
  });
  return results;
};

export const makePOSTRequest = (url: string, data: Object) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const makeAsyncPOSTRequest = async (url: string, body: Object) => {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};
