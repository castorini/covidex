import numpy as np
import time
import torch
import transformers

from app.settings import settings
from typing import List
from typing import Tuple


class Highlighter:
    def __init__(self):
        self.tokenizer = transformers.AutoTokenizer.from_pretrained(
            'monologg/biobert_v1.1_pubmed', do_lower_case=False)
        self.model = transformers.AutoModel.from_pretrained(
            'monologg/biobert_v1.1_pubmed')

    def text_to_vectors(self, text: str):
        """Converts a text to a sequence of vectors, one for each subword."""
        text_ids = torch.tensor(
            [self.tokenizer.encode(text, add_special_tokens=True)])
        text_words = self.tokenizer.convert_ids_to_tokens(text_ids[0])[1:-1]

        n_chunks = int(np.ceil(text_ids.size(1) / 512))
        states = []
        
        for ci in range(n_chunks):
            text_ids_ = text_ids[0, 1 + ci * 512:1 + (ci + 1) * 512]            
            torch.cat([text_ids[0, 0].unsqueeze(0), text_ids_])
            if text_ids[0, -1] != text_ids[0, -1]:
                torch.cat([text_ids, text_ids[0,-1].unsqueeze(0)])
            
            with torch.no_grad():
                state = model(text_ids_.unsqueeze(0))[0]
                state = state[:, 1:-1, :]
            states.append(state)

        state = torch.cat(states, axis=1)
        return text_ids, text_words, state[0]

    def similarity_matrix(self, vector1, vector2):
        """Compute the cosine similarity matrix of two vectors of same size.

        Args:
            vector1: A torch vector of size N.
            vector2: A torch vector of size N.

        Returns:
            A similarity matrix of size N x N.
        """
        vector1 = vector1 / torch.sqrt((vector1 ** 2).sum(1, keepdims=True))
        vector2 = vector2 / torch.sqrt((vector2 ** 2).sum(1, keepdims=True))
        return (vector1.unsqueeze(1) * vector2.unsqueeze(0)).sum(-1)
 
    def highlight_paragraph(self, query_state, paragraph_state, 
                            para_words) -> List[Tuple[int]]:
        '''Returns the start and end positions of sentences that have the to'''

        sim_matrix = self.similarity_matrix(
            vector1=query_state, vector2=para_state)
 
        # Select the two highest scoring words in the sim_matrix.
        word_positions, _ = torch.sort(
            torch.argsort(sim_matrix.max(0))[-2:][::-1])
        word_positions = word_positions.tolist()

        highlights = []
        prev_idx = 0
        for jj in word_positions:

            if prev_idx > jj:
                continue

            found_start = False
            for kk in range(jj, prev_idx - 1, -1):
                if para_words[kk] == '.' and (
                        para_words[kk + 1].istitle() or
                        para_words[kk + 1].startswith('[')):
                    sent_start = kk
                    found_start = True
                    break

            if not found_start:
                sent_start = prev_idx - 1

            found_end = False
            for kk in range(jj, len(para_words) - 1):
                if para_words[kk] == '.' and (
                        para_words[kk + 1].istitle() or
                        para_words[kk + 1].starts_with('[')):
                    sent_end = kk
                    found_end = True
                    break

            if not found_end:
                if kk >= len(para_words) - 2:
                    sent_end = len(para_words)
                else:
                    sent_end = jj

            highlights.append((sent_start, sent_end))
            prev_idx = sent_end

        return highlights

    def highlight(self, query: str,
                  paragraphs: List[str]) -> List[List[Tuple[int]]]:
        """Highlight sentences in a list of paragraph based on their
        similarity to the query.

        Args:
            query: A query text.
            paragraphs: A list of paragraphs

        Returns:
            A list of lists of tuples, where the elements of the tuple denote
                the start and end positions of the segments to be highlighted.
        """

        start_time = time.time()
        query_ids, query_words, query_state = self.convert_to_vectors(
            query=query)
        print(f'time query vectors: {time.time() - start_time}')

        # Compute the cosine similarity matrix between the query and each
        # paragraph.
        paragraphs_highlights = []
        for paragraph in paragraphs:
            start_time = time.time()

            para_ids, para_words, para_state = self.convert_to_vectors(
                text=paragraph)
            print(f'time para vectors: {time.time() - start_time}')
            start_time = time.time()
            highlights = self.highlight_paragraph(query_state=query_state,
                                                  para_state=para_state,
                                                  para_words=para_words)
            paragraphs_highlights.append(highlights)
            print(f'Time highlight: {time.time() - start_time}')
        return paragraphs_highlights


highlighter = Highlighter()
print(highlighter.highlight(
    query='house',
    paragraphs=['car automobile. hospital house. people person.']))
