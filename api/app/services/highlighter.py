import spacy
import torch
import transformers

from app.settings import settings
from typing import List
from typing import Tuple


class Highlighter:
    def __init__(self):

        self.device = torch.device(settings.highlight_device)

        print('Loading tokenizer...')
        self.tokenizer = transformers.AutoTokenizer.from_pretrained(
            'monologg/biobert_v1.1_pubmed', do_lower_case=False)
        print('Loading model...')
        self.model = transformers.AutoModel.from_pretrained(
            'monologg/biobert_v1.1_pubmed')
        self.model.to(self.device)

        print('Loading sentence tokenizer...')
        self.nlp = spacy.blank("en")
        self.nlp.add_pipe(self.nlp.create_pipe("sentencizer"))

        self.highlight_token = '[HIGHLIGHT]'

    def text_to_vectors(self, text: str):
        """Converts a text to a sequence of vectors, one for each subword."""
        text_ids = torch.tensor(
            self.tokenizer.encode(text, add_special_tokens=True))
        text_ids = text_ids.to(self.device)

        text_words = self.tokenizer.convert_ids_to_tokens(text_ids)[1:-1]

        states = []
        for i in range(1, text_ids.size(0), 510):
            text_ids_ = text_ids[i: i + 510]
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
        word_positions = word_positions.tolist()

        tagged_para_words = []
        for kk, word in enumerate(para_words):
            if kk in word_positions:
                tagged_para_words.append(self.highlight_token)
            tagged_para_words.append(word)
        tagged_paragraph = self.tokenizer.convert_tokens_to_string(
            tagged_para_words)

        for special_char in ['.', ',', ':', ';', '?', '!', '[', ']', '(', ')',
                             '{', '}']:
            tagged_paragraph = tagged_paragraph.replace(
                ' ' + special_char, '.')

        tagged_sentences = [
            sent.string.strip()
            for sent in self.nlp(tagged_paragraph[:10000]).sents]
        highlights = []
        last_pos = 0
        for sent in tagged_sentences:
            pos = last_pos + len(sent)
            if self.highlight_token in sent:
                pos -= (len(self.highlight_token) + 1)
                highlights.append((last_pos, pos))
            last_pos = pos + 1
        return highlights

    def highlight_paragraphs(self, query: str,
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

        query_words, query_state = self.text_to_vectors(text=query)

        # Compute the cosine similarity matrix between the query and each
        # paragraph.
        paragraphs_highlights = []
        for paragraph in paragraphs:

            para_words, para_state = self.text_to_vectors(text=paragraph)
            highlights = self.highlight_paragraph(query_state=query_state,
                                                  para_state=para_state,
                                                  para_words=para_words)
            paragraphs_highlights.append(highlights)
        return paragraphs_highlights


highlighter = Highlighter()
