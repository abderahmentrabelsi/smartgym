
import os
import sys
from dotenv import load_dotenv
from loguru import logger

required_env_vars = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'EAI_USERNAME',
    'EAI_PASSWORD',
    'GROBID_BASE_URL',
    'TORCHSERVE_BASE_URL',
    'SP_URL',
    'SP_USER',
    'SP_PASS',
    'MEILISEARCH_HOST',
    'MEILISEARCH_API_KEY'
]

optional_env_vars = {
    'REDIS_HOST': '!!! This is needed if you want to use Redis as the cache driver !!!',
    'REDIS_PASSWORD': '!!! If using Redis as the cache driver, be sure it\'s not needed !!!',
    'CACHE_DRIVER': 'It defaults to the memory driver',
    'DB_PORT': 'It defaults to 27017',
    'REDIS_PORT': 'It defaults to 6379',
    'SP_CRAWL_PARALLELIZATION_FACTOR': 'It defaults to 1',
    'APP_ENV': 'It defaults to production',
}


def check_required_env_vars():
    """Check if all required environment variables are set"""
    for var in required_env_vars:
        if var not in os.environ:
            logger.error(f'ERROR: {var} is not set. '
                  f'It needs to be set in either system environment variables or in a .env file (stub in .env.example).'
                  f'Please contact the environment maintainer for any issues. '
                  f'Exiting...')
            sys.exit(1)


def check_optional_env_vars():
    """Check if all optional environment variables are set"""
    for var in optional_env_vars:
        if var not in os.environ:
            logger.warning(f'WARNING: {var} is not set. {optional_env_vars[var]}')


def check_env_vars():
    check_required_env_vars()
    check_optional_env_vars()


load_dotenv()
check_env_vars()
