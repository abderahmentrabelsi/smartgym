from stop_words import get_stop_words

stopwords = get_stop_words('english')


def remove_stopwords(text):
    # remove stopwords
    text = [word for word in text if word not in stopwords]
    return " ". join(text)
