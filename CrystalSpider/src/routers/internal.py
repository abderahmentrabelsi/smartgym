from fastapi import APIRouter

from clients import meilisearch_client
from common.caching import cache

router = APIRouter(prefix="/internal")


@router.get("/flush-cache")
async def flush_cache_endpoint():
    cache.flush()
    return {"message": "Cache flushed"}


@router.get("/configure-index")
async def configure_index_endpoint():
    meilisearch_client.configure_settings()
    return {"message": "Index configured"}
