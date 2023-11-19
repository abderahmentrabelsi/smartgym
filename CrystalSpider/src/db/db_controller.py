import os
import sys
from typing import Type

from pymongo import MongoClient, ReturnDocument
from pymongo.collection import Collection
from pymongo.server_api import ServerApi
from loguru import logger


class DBController:
    def __init__(self):
        self.client = None
        self.__db = None

    def connect(self):
        try:
            self.client = MongoClient(
                f'mongodb+srv://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}'
                f'/{os.getenv("DB_NAME")}?retryWrites=true&w=majority',
                server_api=ServerApi('1'))
            self.__db = self.client.test
            logger.success(f"DB connection established.")
        except Exception as e:
            logger.error(f"DB connection failed.")
            logger.exception(e)
            exit(1)

    def disconnect(self):
        if self.client is not None:
            self.client.close()
        self.client = None
        self.__db = None

    def connection_test(self):
        try:
            self.connect()
            self.get_db().command('ping')
            return True
        except Exception as e:
            print(f"DB connection failed: {str(e)}", file=sys.stderr)
            exit(1)

    def get_db(self):
        if self.client is not None and self.__db is not None:
            return self.__db

        self.connect()
        return self.__db

    def get_collection(self) -> Type[Collection]:
        return self.get_db().articles
