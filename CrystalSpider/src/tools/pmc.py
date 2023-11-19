from requests_html import HTMLSession


def get_pmc_pdf_url(id: str):
    session = HTMLSession()
    url = f'https://www.ncbi.nlm.nih.gov/pmc/articles/{id}/'
    response = session.get(url=url, timeout=8)
    try:
        pdf_url = 'https://www.ncbi.nlm.nih.gov' + response.html.find('a.int-view', first=True).attrs['href']
        return pdf_url, url
    except Exception:
        return None, url
