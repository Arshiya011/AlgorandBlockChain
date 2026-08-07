import re


def split_into_clauses(text: str):
    """
    Splits contract text into clauses using numbered headings.
    """

    clauses = re.split(r"\n\s*\d+\.\s+", text)

    clauses = [clause.strip() for clause in clauses if clause.strip()]

    return clauses