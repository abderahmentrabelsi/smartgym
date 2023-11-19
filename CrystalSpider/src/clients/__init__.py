from .expert_ai import ExpertAiProcessor
from .grobid import GrobidClient
from .meilisearch import MeilisearchClient
from .sharepoint import SharePointCrawler
from .torchserve import HostedModelsClient

meilisearch_client: MeilisearchClient = MeilisearchClient()
grobid_client: GrobidClient = GrobidClient()
sharepoint_crawler: SharePointCrawler = SharePointCrawler(grobid_client)
caching_expert_ai_client: ExpertAiProcessor = ExpertAiProcessor()
host_models_client: HostedModelsClient = HostedModelsClient()
