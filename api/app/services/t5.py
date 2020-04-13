from functools import lru_cache
from typing import Sequence, Tuple

from transformers import T5Tokenizer
import torch

from app.modeling import CachedT5ModelLoader
from app.settings import settings


class T5ModelProvider:
    def __init__(self):
        loader = CachedT5ModelLoader(settings.t5_model_dir,
                                     settings.cache_dir,
                                     'ranker',
                                     settings.t5_model_type,
                                     settings.flush_cache)
        self.device = torch.device(settings.t5_device)
        self.model = loader.load().to(self.device).eval()
        with torch.no_grad():  # Make more similar to TensorFlow implementation
            self.model.decoder.block[0].layer[1].EncDecAttention.relative_attention_bias.weight.data.zero_()
        self.tokenizer = T5Tokenizer.from_pretrained(settings.t5_model_type)  # type: T5Tokenizer
        self.t5_max_length = settings.t5_max_length

    def preprocess(self,
                   batch_inputs: Sequence[str],
                   ignore_max_length: bool = False) -> Tuple[torch.Tensor, torch.Tensor]:
        input_ids = []
        # TensorFlow padding convention
        for input_text in batch_inputs:
            ids = provider.tokenizer.encode(input_text, max_length=None if ignore_max_length else self.t5_max_length)
            if ignore_max_length or len(ids) < self.t5_max_length:
                ids.append(self.model.config.eos_token_id)
            input_ids.append(ids)

        max_len = max(map(len, input_ids))
        attn_mask = torch.tensor([[1] * len(x) + [0] * (max_len - len(x)) for x in input_ids])
        input_ids = torch.tensor([x + [0] * (max_len - len(x)) for x in input_ids])
        attn_mask = attn_mask.to(self.device)
        input_ids = input_ids.to(self.device)
        return input_ids, attn_mask


class T5EncoderVectorCache:
    def __init__(self, provider: T5ModelProvider):
        self.provider = provider

    @lru_cache(maxsize=settings.t5_cache_size)
    def encode(self, text: str) -> Tuple[Sequence[str], torch.Tensor]:
        input_ids, attn_mask = self.provider.preprocess([text], ignore_max_length=True)
        text_words = self.provider.tokenizer.convert_ids_to_tokens(input_ids[0])

        states = []
        for i in range(0, input_ids.size(1), 512):
            input_ids_slice = input_ids[:, i:i + 512]
            attn_mask_slice = attn_mask[:, i:i + 512]
            with torch.no_grad():
                state, = self.provider.model.encoder(input_ids=input_ids_slice, attention_mask=attn_mask_slice)
            states.append(state)
        state = torch.cat(states, axis=1).squeeze(0)
        return text_words[:-1], state[:-1]


provider = T5ModelProvider()
encoder_vector_cache = T5EncoderVectorCache(provider)
