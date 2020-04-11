from app.settings import settings
if settings.t5_device.startswith('cuda:'):
    import os
    os.environ["CUDA_VISIBLE_DEVICES"] = settings.t5_device.replace('cuda:', '')  # noqa: E501
import tensorflow.compat.v1 as tf  # noqa: E402
import tensorflow_text  # Do not remove! It is needed to import the model  # noqa: F401, E501
import torch  # noqa: E402

from typing import List  # noqa: E402


class Ranker:
    def __init__(self):

        tf.reset_default_graph()
        self.session = tf.Session()
        meta_graph_def = tf.saved_model.loader.load(
            self.session, ["serve"], settings.t5_model_dir)
        self.signature_def = meta_graph_def.signature_def["serving_default"]

    async def predict_t5(self, inputs: List[str]) -> List[float]:

        log_probs = []
        for i in range(0, len(inputs), settings.t5_batch_size):
            batch_inputs = inputs[i:i + settings.t5_batch_size]

            batch_scores = self.session.run(
                fetches=self.signature_def.outputs["scores"].name,
                feed_dict={
                    self.signature_def.inputs["input"].name: batch_inputs})

            # 6136 and 1176 are the indexes of the tokens false and true in T5.
            batch_scores = batch_scores[:, [6136, 1176]]
            batch_log_probs = torch.nn.functional.log_softmax(
                torch.from_numpy(batch_scores), dim=1)
            batch_log_probs = batch_log_probs[:len(batch_inputs), 1].tolist()
            log_probs.extend(batch_log_probs)

        return log_probs


ranker = Ranker()
