torchserve --stop
torch-model-archiver --model-name retrieve_and_rank --version 1.0 --serialized-file UNUSED --handler handler.py --extra-files ./models/ --export-path model_store -f
torchserve --start --model-store model_store --models retrieve_and_rank=retrieve_and_rank.mar --ts-config config.properties --ncs