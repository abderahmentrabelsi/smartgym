import os
from sentence_transformers import SentenceTransformer, CrossEncoder


def download_model(model_name: str, output_dir: str):
    if model_name == 'sentence-transformers/paraphrase-distilroberta-base-v1':
        model = SentenceTransformer(model_name)
    elif model_name == 'cross-encoder/ms-marco-MiniLM-L-6-v2':
        model = CrossEncoder(model_name)
    model.save(output_dir)


if __name__ == "__main__":
    model_names = [
        'sentence-transformers/paraphrase-distilroberta-base-v1',
        'cross-encoder/ms-marco-MiniLM-L-6-v2'
    ]

    model_dir = 'models'

    if not os.path.exists(model_dir):
        os.makedirs(model_dir)

    for model_name in model_names:
        output_dir = os.path.join(model_dir, model_name)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            download_model(model_name, output_dir)
