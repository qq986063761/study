# -*- coding: utf-8 -*-


OFFLINE_SEARCH_INDEX = {
    "apple": (
        "Apple reported resilient services growth and continued device demand pressure "
        "in the offline sample news set."
    ),
    "tesla": (
        "Tesla sample news mentions margin pressure, delivery volatility, and energy "
        "storage growth."
    ),
}


def search(query):
    lowered = query.lower()
    for keyword, result in OFFLINE_SEARCH_INDEX.items():
        if keyword in lowered:
            return result
    return "No exact offline result found. Use a real web search API in production."
