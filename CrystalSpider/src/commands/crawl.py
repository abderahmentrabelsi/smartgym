import os
import sys

from clients.sharepoint import FormatAdapter
from clients import sharepoint_crawler

# generate Sharepoint search string from FormatAdapter.supported_formats
filetypes = ' OR '.join([f'FileType:{file_type}' for file_type in FormatAdapter.supported_formats])

# change this to today - 1 day
query = f"Path:{os.environ.get('SP_URL')}sites/EU-Search-Demo IsDocument:1 AND ({filetypes}) {'AND LastModifiedTime=today' if (len(sys.argv) > 1 and sys.argv[1] == 'daily') else ''}"

results = sharepoint_crawler.crawl(query)
print(results)
