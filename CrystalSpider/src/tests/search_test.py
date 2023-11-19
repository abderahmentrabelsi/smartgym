from clients import meilisearch_client

meilisearch_client.configure_settings()

print(meilisearch_client.search("cancer", 0, 10))

