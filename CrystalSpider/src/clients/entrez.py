import os

from Bio import Entrez


def search(query, qty=100):
    Entrez.email = os.getenv("ENTREZ_EMAIL")
    handle = Entrez.esearch(db='pmc',
                            sort='relevance',
                            retmax=str(qty),
                            retmode='xml',
                            term=query)
    results = Entrez.read(handle)

    ids = pmc2pubmed(results['IdList']) if int(results["Count"]) > 0 else []
    return ids


# Not used for now
def correct_query(query):
    Entrez.email = os.getenv("ENTREZ_EMAIL")
    handle = Entrez.espell(term=query)
    record = Entrez.read(handle)
    if record["CorrectedQuery"] != "":
        return record['CorrectedQuery']
    else:
        return query


def fetch_details(id_list):
    """
        - Return article summaries in json format
        - Return error if any occurs
        """
    try:
        ids = ','.join(id_list)
        Entrez.email = os.getenv("ENTREZ_EMAIL")
        handle = Entrez.efetch(db='pubmed',
                               retmode='xml',
                               rettype='full',
                               id=ids)
        results = Entrez.read(handle, validate=False)
        return results

    except Exception as e:
        return {"fetch_details": str(e)}


def pmc2pubmed(id_list):
    pubmed_ids = []
    ids = ','.join(id_list)
    Entrez.email = os.getenv("ENTREZ_EMAIL")
    handle = Entrez.elink(dbfrom="pmc", db="pubmed", linkname="pmc_pubmed", id=ids, retmode="text")
    result = Entrez.read(handle)
    for i in result[0]['LinkSetDb'][0]['Link']:
        pubmed_ids.append(i['Id'])
    handle.close()
    return pubmed_ids
