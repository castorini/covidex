import numpy as np
import time
import torch
import transformers

from app.settings import settings
from typing import List
from typing import Tuple


class Highlighter:
    def __init__(self):
        print('Loading tokenizer...')
        self.tokenizer = transformers.AutoTokenizer.from_pretrained(
            'monologg/biobert_v1.1_pubmed', do_lower_case=False)
        print('Loading model...')
        self.model = transformers.AutoModel.from_pretrained(
            'monologg/biobert_v1.1_pubmed')

    def text_to_vectors(self, text: str):
        """Converts a text to a sequence of vectors, one for each subword."""
        text_ids = torch.tensor(
            self.tokenizer.encode(text, add_special_tokens=True))
        text_words = self.tokenizer.convert_ids_to_tokens(text_ids)[1:-1]

        n_chunks = int(np.ceil(text_ids.size(0) / 512))
        states = []
        for ci in range(n_chunks):
            text_ids_ = text_ids[1 + ci * 512:1 + (ci + 1) * 512]
            text_ids_ = torch.cat([text_ids[0].unsqueeze(0), text_ids_])
           
            if text_ids_[-1] != text_ids[-1]:
                text_ids_ = torch.cat(
                    [text_ids_, text_ids[-1].unsqueeze(0)])

            with torch.no_grad():
                state, _ = self.model(text_ids_.unsqueeze(0))
                state = state[0, 1:-1, :]
            states.append(state)
        state = torch.cat(states, axis=0)
        return text_words, state

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

    def highlight_paragraph(self, query_state, para_state,
                            para_words) -> List[Tuple[int]]:
        '''Returns the start and end positions of sentences that have the to'''

        sim_matrix = self.similarity_matrix(
            vector1=query_state, vector2=para_state)

        # Select the two highest scoring words in the sim_matrix.
        _, word_positions = torch.topk(
            sim_matrix.max(0)[0], k=2, largest=True, sorted=False)
        word_positions = sorted(word_positions.tolist())

        sents_offsets = []
        previous_word = ''
        word2char = {}
        total_length = 0
        for kk, word in enumerate(para_words):
            word2char[kk] = total_length

            if previous_word == '.' and (
                    word.istitle() or word.startswith('[')):
                sents_offsets.append(kk)

            total_length += len(word) + 1
            if word.startswith('##'):
                total_length -= 3
            elif word in ['.', ',', ';', ':', '!', '?']:
                total_length -= 1

            previous_word = word

        word2char[len(para_words)] = total_length + 1
        sents_offsets.append(len(para_words))

        highlights = []
        last_sent_offset = 0
        for jj in word_positions:
            for sent_offset in sents_offsets:   
                if jj >= last_sent_offset and jj < sent_offset:
                    highlights.append((last_sent_offset, sent_offset))
                last_sent_offset = sent_offset

        # Remove duplicates.
        dedup_highlights = []
        seen_highlights = set()
        for highlight in highlights:
            if highlight not in seen_highlights:
               dedup_highlights.append(highlight)
            seen_highlights.add(highlight)

        # Convert highlights to character positions.
        char_highlights = [
            (word2char[start], word2char[end] - 1)
            for start, end in dedup_highlights]

        return char_highlights

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
        query_words, query_state = self.text_to_vectors(text=query)
        print(f'time query vectors: {time.time() - start_time}')

        # Compute the cosine similarity matrix between the query and each
        # paragraph.
        paragraphs_highlights = []
        for paragraph in paragraphs:
            start_time = time.time()

            para_words, para_state = self.text_to_vectors(text=paragraph)
            print(f'time para vectors: {time.time() - start_time}')
            start_time = time.time()
            highlights = self.highlight_paragraph(query_state=query_state,
                                                  para_state=para_state,
                                                  para_words=para_words)
            for start, end in highlights:
                print(f'"{paragraph[start:end]}"')
            paragraphs_highlights.append(highlights)
            print(f'Time highlight: {time.time() - start_time}')
        return paragraphs_highlights


highlighter = Highlighter()
for query in ['Car', 'house', 'home', 'person', 'man']:
    print(query)
    highlighter.highlight(
        query=query,
        paragraphs=['Car automobile. Hospital house. People person.'])
