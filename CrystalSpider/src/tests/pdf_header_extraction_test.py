import io
from dotenv import load_dotenv
load_dotenv()

from common.env_init import check_required_env_vars, check_optional_env_vars
check_required_env_vars()
check_optional_env_vars()

from clients.sharepoint import SPDoc, SharePointCrawler

doc = SPDoc(
    Path="dummy",
    DocId="dummy",
    ContentBuffer=io.BytesIO(open("src/tests/test_data/bellacosa1996.pdf", "rb").read()),
    FileType="pdf",
    LastModifiedTime="dummy",
    Title="dummy"
)

crawler = SharePointCrawler()
crawler.process_sp_doc(doc)

# Path: src\sharepoint\sharepoint.py
