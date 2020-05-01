from functools import partial
from typing import List

from transformers import T5Tokenizer
import torch

from app.modeling import CachedT5ModelLoader, greedy_decode
from app.settings import settings


class Ranker:
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

    async def predict_t5(self, inputs: List[str]) -> List[float]:
        log_probs = []
        for i in range(0, len(inputs), settings.t5_batch_size):
            batch_inputs = inputs[i:i + settings.t5_batch_size]
            # TensorFlow padding convention
            input_ids = []
            for input_text in batch_inputs:
                ids = self.tokenizer.encode(input_text, max_length=self.t5_max_length)
                if len(ids) < self.t5_max_length:
                    ids.append(1)
                input_ids.append(ids)

            max_len = max(map(len, input_ids))
            attn_mask = torch.tensor([[1] * len(x) + [0] * (max_len - len(x)) for x in input_ids])
            input_ids = torch.tensor([x + [0] * (max_len - len(x)) for x in input_ids])
            # Use two-step decoding to match the TensorFlow implementation
            _, batch_scores = greedy_decode(self.model,
                                            input_ids.to(self.device),
                                            length=2,
                                            attention_mask=attn_mask.to(self.device),
                                            return_last_logits=True)

            # 6136 and 1176 are the indexes of the tokens false and true in T5.
            batch_scores = batch_scores[:, [6136, 1176]]
            batch_log_probs = torch.nn.functional.log_softmax(batch_scores, dim=1)
            batch_log_probs = batch_log_probs[:, 1].tolist()
            log_probs.extend(batch_log_probs)

        return log_probs


ranker = Ranker()
