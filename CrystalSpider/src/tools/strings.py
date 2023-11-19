def remove_special_characters(text):
    t = ""
    for i in text:
        # Store only valid characters
        if ('A' <= i <= 'Z') or ('a' <= i <= 'z') or " ":
            t += i
    return t
