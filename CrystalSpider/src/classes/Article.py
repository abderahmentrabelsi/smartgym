from abc import ABC

from requests_html import HTMLSession
from stop_words import get_stop_words

from db import db_controller
from pymongo import ReplaceOne
from loguru import logger

from tools.pubdate import pubdate_deconstruct
from tools.summary import destructure_paper_summary

from clients import caching_expert_ai_client

s = HTMLSession()


class Article(ABC):
    def __init__(self, obj: dict, query: str):
        self.title = obj['Title'] if 'Title' in obj else obj['title']
        self.authors = obj['authors']
        self.abstract = obj['abstract']
        self.pubdate = pubdate_deconstruct(obj['pubdate'])
        self.query = query

        self.id = None
        self.source = None
        self.score = None

        if "keywords" in obj and "lemmas" in obj:
            self.keywords = obj['keywords']
            self.lemmas = obj['lemmas']
        else:
            self.keywords, self.lemmas = self.lemmas_func()

    def __getattr__(self, item):
        try:
            return self.__dict__[item]
        except KeyError:
            return None

    def lemmas_func(self):
        res = set()
        logger.info(f"Getting keywords and lemmas for {self.title} from expert.ai")

        try:
            response = caching_expert_ai_client.specific_resource_analysis(f"{self.title}\n{self.abstract}")
        except Exception as e:
            logger.error(f"Failed extracting keywords and lemmas for {self.title} from expert.ai. {e}")
            logger.warning(f"Truncating abstract to 200 words and trying again.")
            shortened_abstract = self.abstract
            for stopword in get_stop_words('english'):
                shortened_abstract = shortened_abstract.replace(stopword, '')
            shortened_abstract = ' '.join(shortened_abstract.split())[5000:]
            response = caching_expert_ai_client.specific_resource_analysis(f"{self.title}\n{shortened_abstract}")

        for topic in filter(lambda x: x.winner is True and x.score >= 7, response.topics):
            res.add(topic.label)
        for main_sentence in filter(lambda x: x.score >= 15, response.main_sentences):
            res.add(main_sentence.value)
        for main_phrase in filter(lambda x: x.score >= 13, response.main_phrases):
            res.add(main_phrase.value)
        for main_lemma in filter(lambda x: x.score >= 17, response.main_lemmas):
            res.add(main_lemma.value)
        for main_syncons in filter(lambda x: x.score >= 10, response.main_syncons):
            res.add(main_syncons.lemma)

        return list(filter(lambda x: " " not in x, res)), list(filter(lambda x: " " in x, res))

    def set_score(self, value):
        self.score = value

    def to_dict(self):
        return {
            '_id': self.id,
            'id': self.id,
            'title': self.title,
            'authors': self.authors,
            'pubdate': self.pubdate,
            'abstract': self.abstract,
            'keywords': self.keywords,
            'lemmas': self.lemmas,
            'source': self.source
        }

    def persist(self):
        _dict = self.to_dict()
        _dict['_id'] = self.id
        db_controller.get_collection().bulk_write([
            ReplaceOne({'_id': self.id}, _dict, upsert=True)
        ])


class PMCArticle(Article):
    def __init__(self, blob: any, query: str):
        obj = destructure_paper_summary(blob)
        super().__init__(obj, query)
        self.source = "PMC"
        self.id = obj['pmc_id']

    def __getitem__(self, key):
        if key in self.__dict__:
            return self.__dict__[key]
        else:
            return None

class SharePointArticle(Article):
    def __init__(self, obj: dict, query: str):
        super().__init__(obj, query)
        self.id = obj['DocId'] if 'DocId' in obj else obj['id']
        self.source = "SharePoint"
        self.path = obj['Path'] if 'Path' in obj else obj['path']

    def __getitem__(self, key):
        if key in self.attributes:
            return self.attributes[key]
        else:
            return None

    def persist(self):
        super().persist()
        # add to log4j

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'authors': self.authors,
            'pubdate': self.pubdate,
            'abstract': self.abstract,
            'keywords': self.keywords,
            'lemmas': self.lemmas,
            'source': self.source,
            'path': self.path
        }


class DBArticle(Article, ABC):
    def __init__(self, obj: dict, query: str):
        super().__init__(obj, query)
        self.source = obj['where'] if 'where' in obj else obj['source']

        if 'id' in obj:
            self.id = obj['id']
        elif 'pmc_id' in obj:
            self.id = obj['pmc_id']
        else:
            self.id = obj['_id']

    def __getitem__(self, key):
        if key in self.__dict__:
            return self.__dict__[key]
        else:
            return None
