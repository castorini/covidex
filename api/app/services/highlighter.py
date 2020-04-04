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
                            para_words, original_paragraph) -> List[Tuple[int]]:
        '''Returns the start and end character positions of highlighted sentences'''

        if original_paragraph is None or original_paragraph == "":
            return '', []

        sim_matrix = self.similarity_matrix(
            vector1=query_state, vector2=para_state)

        # Select the two highest scoring words in the sim_matrix.
        _, word_positions = torch.topk(
            sim_matrix.max(0)[0], k=2, largest=True, sorted=False)
        word_positions = word_positions.tolist()

        # Append a special highlight token to top-scoring words.
        for kk in word_positions:
            para_words[kk] += self.highlight_token

        tagged_paragraph = self.tokenizer.convert_tokens_to_string(
            para_words)

        # Clean up a list of simple English tokenization artifacts like spaces
        # before punctuations and abreviated forms.
        tagged_paragraph = self.tokenizer.clean_up_tokenization(
            tagged_paragraph)

        tagged_sentences = [
            sent.string.strip()
            for sent in self.nlp(tagged_paragraph[:10000]).sents]

        new_paragraph = []
        highlights = []
        last_pos = 0
        for sent in tagged_sentences:
            if self.highlight_token in sent:
                sent = sent.replace(self.highlight_token, '')
                highlights.append((last_pos, last_pos + len(sent)))

            new_paragraph.append(sent)
            last_pos += len(sent) + 1

        highlighted = ' '.join(new_paragraph)
        return self.adjust_highlights(original_paragraph, highlighted, highlights)

    def adjust_highlights(self, original_text: str, highlighted_text: str,
                          highlights: List[List[Tuple[int]]]):
        """
        Adjusts highlights based on extra spaces introduced by the tokenization process.
        Iterates over highlighted and original text simultaneously to compute character positions.
        """

        if len(highlights) == 0:
            return original_text, []

        highlights_idx = 0
        original_text_idx = 0
        highlighted_text_idx = 0
        new_highlight_start = -1
        inside_highlight = False
        adjusted_highlights = []

        while original_text_idx < len(original_text) and highlighted_text_idx < len(highlighted_text) \
            and highlights_idx < len(highlights):

            original_char = original_text[original_text_idx]
            highlighted_char = highlighted_text[highlighted_text_idx]
            cur_highlight = highlights[highlights_idx]

            # Adjust highlights based on current text indices
            if not inside_highlight and highlighted_text_idx >= cur_highlight[0]:
                inside_highlight = True
                new_highlight_start = original_text_idx
            elif inside_highlight and highlighted_text_idx >= cur_highlight[1]:
                inside_highlight = False
                adjusted_highlights.append([new_highlight_start, original_text_idx])
                original_text_idx += 1
                highlights_idx += 1

            # Increment character indexes based on values
            if original_char == highlighted_char:
                original_text_idx += 1
                highlighted_text_idx += 1
            elif original_text[original_text_idx] == " ":
                original_text_idx += 1
            elif highlighted_text[highlighted_text_idx:highlighted_text_idx+5] == "[UNK]":
                # Token was not be able to be parsed properly
                highlighted_text_idx += 5

                # Original text may have multiple spaces and characters to form [UNK] token
                if highlighted_text_idx < len(highlighted_text):
                    highlighted_next = highlighted_text[highlighted_text_idx]
                    while original_text[original_text_idx] != highlighted_next:
                        original_text_idx += 1
            else:
                highlighted_text_idx += 1

        if inside_highlight:
            adjusted_highlights.append([new_highlight_start, len(original_text) - 1])

        return adjusted_highlights

    def highlight_paragraphs(self, query: str,
                             paragraphs: List[str]) -> List[List[Tuple[int]]]:
        """Highlight sentences in a list of paragraph based on their
        similarity to the query.

        Args:
            query: A query text.
            paragraphs: A list of paragraphs

        Returns:
            all_highlights: A list of lists of tuples, where the elements of
                the tuple denote the start and end positions of the segments
                to be highlighted.
        """

        query_words, query_state = self.text_to_vectors(text=query)

        new_paragraphs = []
        all_highlights = []
        for paragraph in paragraphs:
            para_words, para_state = self.text_to_vectors(text=paragraph)
            highlights = self.highlight_paragraph(
                query_state=query_state,
                para_state=para_state,
                para_words=para_words,
                original_paragraph=paragraph)
            all_highlights.append(highlights)
        return all_highlights


highlighter = Highlighter()
