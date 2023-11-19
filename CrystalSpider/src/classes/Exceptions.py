from abc import ABC


class PDFException(Exception, ABC):
    def __init__(self, pmc_id):
        self.pmc_id = pmc_id


class PDFNotFoundException(PDFException):
    pass


class PDFDownloadException(PDFException):
    pass
