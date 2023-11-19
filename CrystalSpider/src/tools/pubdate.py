import traceback
from datetime import datetime


def pubdate_field_extraction(obj, field_name):
    try:
        if field_name in obj:
            field = field_name
        elif field_name.capitalize() in obj:
            field = field_name.capitalize()
        else:
            return None

        if obj[field] is None or obj[field] == '':
            return None

        if type(obj[field]) is int:
            return obj[field]

        if type(obj[field]) is str and obj[field].isnumeric():
            return int(obj[field])

        if field_name == 'month':
            if len(obj[field]) == 3:
                return datetime.strptime(obj[field], '%b').month
            else:
                return datetime.strptime(obj[field], '%B').month

        return None
    except:
        traceback.print_exc()
        return None


def pubdate_deconstruct(obj):
    if obj is None:
        return None

    return {'year': pubdate_field_extraction(obj, 'year'),
            'month': pubdate_field_extraction(obj, 'month'),
            'day': pubdate_field_extraction(obj, 'day')}
