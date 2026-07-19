# -*- coding: utf-8 -*-


FINANCIAL_DB = {
    "apple": {
        "revenue_2023": 383.3,
        "revenue_2022": 394.3,
        "net_income_2023": 97.0,
        "gross_margin": "44.1%",
        "notes": "Strong services segment, weaker hardware cycle in this sample data.",
    },
    "tesla": {
        "revenue_2023": 96.8,
        "revenue_2022": 81.5,
        "net_income_2023": 15.0,
        "gross_margin": "18.2%",
        "notes": "Growth remains high, but margins are under pressure in this sample data.",
    },
}


def query_financials(company):
    row = FINANCIAL_DB.get(company.lower())
    if not row:
        return "No offline financial row for {0}.".format(company)

    return (
        "revenue_2023={revenue_2023}B, "
        "revenue_2022={revenue_2022}B, "
        "net_income_2023={net_income_2023}B, "
        "gross_margin={gross_margin}, "
        "notes={notes}"
    ).format(**row)
