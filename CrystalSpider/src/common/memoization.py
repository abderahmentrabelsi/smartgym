import hashlib
import functools

from typing import Callable
from .caching import cache


def memoize_call(func: Callable):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # Create a unique key based on the function name, arguments, and keyword arguments
        key_elements = [func.__name__] + [str(arg) for arg in args] + [f"{k}={v}" for k, v in kwargs.items()]
        key_string = ":".join(key_elements)
        key_hash = hashlib.sha1(key_string.encode('utf-8')).hexdigest()

        # Check if the result is cached, and if not, call the function and store the result
        if cache.exists(key_hash):
            result = cache.get(key_hash)
        else:
            result = func(*args, **kwargs)
            cache.set(key_hash, result)

        return result

    return wrapper
