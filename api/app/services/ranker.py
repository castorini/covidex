from typing import List
import torch
from pygaggle.model import T5BatchTokenizer
from pygaggle.rerank.base import Query, Text
from pygaggle.rerank.transformer import MonoT5
from transformers import T5Tokenizer
from transformers import T5ForConditionalGeneration
from app.settings import settings


class Ranker:
    def __init__(self):
        self.ranker = self.build_ranker()

    def build_ranker(self) -> MonoT5:
        
        device = torch.device(settings.t5_device)
        model = T5ForConditionalGeneration.from_pretrained(settings.t5_pretrained_model).to(device).eval()
        tokenizer = T5Tokenizer.from_pretrained(settings.t5_model_type)
        batch_tokenizer = T5BatchTokenizer(
            tokenizer, settings.t5_batch_size, max_length=settings.t5_max_length
        )
        return MonoT5(model=model, tokenizer=batch_tokenizer)

    def rescore(self, query: str, texts: List[str]) -> List[float]:
        ranked_results = self.ranker.rescore(Query(query), [Text(t) for t in texts])
        scores = [r.score for r in ranked_results]
        return scores
