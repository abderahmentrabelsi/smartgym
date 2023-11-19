from fastapi import APIRouter
from db import db_controller
from clients import meilisearch_client

router = APIRouter(prefix="/dangerous")


@router.get("/delete-sharepoint-articles")
async def drop_sharepoint_articles():
    meilisearch_client.delete_all_documents()
    db_controller.get_collection().delete_many({'source': 'SharePoint'})
    return {"message": "SharePoint articles deleted"}

@router.get("/delete-all-vectors")
async def drop_all_vectors():
    db_controller.get_collection().update_many({}, {'$unset': {'vector': ""}})
    return {"message": "Vectors deleted"}