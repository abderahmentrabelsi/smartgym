import os
import pickle
from redis import Redis
from loguru import logger


class RedisCache:
    def __init__(self):
        self.redis = Redis(
            host=os.environ.get("REDIS_HOST"),
            port=int(os.environ.get("REDIS_PORT", "6379")),
            password=os.environ.get("REDIS_PASSWORD")
        )

    def set(self, key, value):
        logger.trace(f"Setting cache for key: {key}")
        pickled_value = pickle.dumps(value)
        self.redis.set(key, pickled_value)

    def get(self, key):
        logger.trace(f"Getting cache for key: {key}")
        pickled_value = self.redis.get(key)
        if pickled_value:
            return pickle.loads(pickled_value)
        return None

    def delete(self, key):
        logger.trace(f"Deleting cache for key: {key}")
        self.redis.delete(key)

    def exists(self, key):
        return self.redis.exists(key)

    def flush(self):
        self.redis.flushdb()

    def getOrEval(self, key, callback, *args, **kwargs):
        if self.exists(key):
            logger.trace(f"Cache hit for key: {key}")
            return self.get(key)
        else:
            logger.trace(f"Cache miss for key: {key}")
            value = callback(*args, **kwargs)
            self.set(key, value)
            return value

    def mgetOrEval(self, keys, callback, *args, **kwargs):
        pickled_values = self.redis.mget(keys)
        values = [pickle.loads(pv) if pv else None for pv in pickled_values]
        cache_miss_keys = []
        if not all(values):
            for i, (k, v) in enumerate(zip(keys, values)):
                if not v:
                    cache_miss_keys.append(k)
                    values[i] = callback(k, *args, **kwargs)
            pickled_values_to_set = {k: pickle.dumps(v) for k, v in zip(keys, values) if v is not None}
            self.redis.mset(pickled_values_to_set)
        logger.trace(f"Cache hits for keys: {set(keys) - set(cache_miss_keys)}")
        logger.trace(f"Cache misses for keys: {cache_miss_keys}")
        return values


class MemoryCache:
    counter = 0

    def __init__(self):
        self.counter += 1
        logger.debug(f"MemoryCache instance {self.counter} created")
        self.cache = {}

    def set(self, key, value):
        self.cache[key] = value

    def get(self, key):
        return self.cache.get(key)

    def delete(self, key):
        del self.cache[key]

    def exists(self, key):
        return key in self.cache

    def flush(self):
        self.cache = {}

    def getOrEval(self, key, callback, *args, **kwargs):
        if self.exists(key):
            return self.get(key)
        else:
            value = callback(*args, **kwargs)
            self.set(key, value)
            return value

    def mgetOrEval(self, keys, callback, *args, **kwargs):
        values = [self.get(k) for k in keys]
        if not all(values):
            for i, (k, v) in enumerate(zip(keys, values)):
                if not v:
                    values[i] = callback(k, *args, **kwargs)
            self.set(keys, values)
        return values


# make it a singleton
cache = RedisCache() if os.environ.get("CACHE_DRIVER", "MEMORY") == "REDIS" else MemoryCache()
