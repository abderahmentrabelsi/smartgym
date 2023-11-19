import re

from Bio.Entrez.Parser import StringElement


def destructure_paper_summary(paper):
    title = extract_title(paper)
    keywords = extract_keywords(paper)
    authors = extract_authors(paper)
    pubdate = extract_pubdate(paper)
    abstract = extract_abstract(paper)
    pmc_id = extract_pmc_id(paper)

    paper_summary = {
        'Title': title,
        'authors': authors,
        'pubdate': pubdate,
        'abstract': abstract,
        'pmc_id': pmc_id,
        'keywords': keywords
    }
    return paper_summary


def extract_title(paper):
    return re.sub('<.*?>', "", paper['MedlineCitation']['Article']['ArticleTitle'])


def extract_keywords(paper):
    keyword_list = paper['MedlineCitation'].get('KeywordList', [])
    return [str(keyword) for keyword in keyword_list[0]] if keyword_list else []


def extract_authors(paper):
    author_list = paper['MedlineCitation']['Article'].get('AuthorList', [])
    authors = []
    for author in author_list:
        if 'ForeName' in author and 'LastName' in author:
            authors.append(f"{author['ForeName']} {author['LastName']}")
    if not authors:
        authors.append('Unfortunately, no authors were found')
    return authors


def extract_pubdate(paper):
    pubdate = paper['MedlineCitation']['Article']['Journal']['JournalIssue']['PubDate']
    return {key: str(value) if isinstance(value, StringElement) else value for key, value in pubdate.items()}


def extract_abstract(paper):
    abstract_text = paper['MedlineCitation']['Article'].get('Abstract', {}).get('AbstractText', [])
    return re.sub(r"<.*?>", "", "".join(abstract_text))


def extract_pmc_id(paper):
    article_id_list = paper['PubmedData']['ArticleIdList']
    return next((str(potential_pmc_id) for potential_pmc_id in article_id_list if potential_pmc_id.startswith('PMC')), '')
