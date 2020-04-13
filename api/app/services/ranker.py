from typing import List

import torch

from app.modeling import greedy_decode
from app.settings import settings
from app.services.t5 import provider


class Ranker:
    def __init__(self):
        self.t5_max_length = settings.t5_max_length

    async def predict_t5(self, inputs: List[str]) -> List[float]:
        log_probs = []
        for i in range(0, len(inputs), settings.t5_batch_size):
            batch_inputs = inputs[i:i + settings.t5_batch_size]
            input_ids, attn_mask = provider.preprocess(batch_inputs)
            _, batch_scores = greedy_decode(provider.model,
                                            input_ids,
                                            length=2,
                                            attention_mask=attn_mask,
                                            return_last_logits=True)

            # 6136 and 1176 are the indexes of the tokens false and true in T5.
            batch_scores = batch_scores[:, [6136, 1176]]
            batch_log_probs = torch.nn.functional.log_softmax(batch_scores, dim=1)
            batch_log_probs = batch_log_probs[:, 1].tolist()
            log_probs.extend(batch_log_probs)

        return log_probs


ranker = Ranker()
