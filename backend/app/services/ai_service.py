import os
import json

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_clause(clause: str):

    prompt = f"""
You are an expert legal contract risk analyst.

Analyze the following CONTRACT CLAUSE.

Classify the legal or financial risk as:

Low
Medium
High

Return ONLY valid JSON.

Use exactly this structure:

{{
    "risk_level": "Low",
    "reason": "Short and simple explanation of the risk.",
    "suggestion": "Safer wording or recommendation."
}}

Risk guidelines:

LOW:
The clause is generally fair and contains little legal or financial risk.

MEDIUM:
The clause contains unclear language, one-sided obligations,
moderate liability, or conditions that should be reviewed.

HIGH:
The clause may cause serious legal or financial consequences,
contains unlimited liability, unfair termination rights,
very broad indemnification, severe penalties, or other
strongly one-sided obligations.

Do not provide legal advice.
Explain the risk in simple language.

Contract Clause:

{clause}
"""

    response = client.chat.completions.create(
        model=os.getenv("MODEL_NAME"),
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = (
        response
        .choices[0]
        .message
        .content
        .strip()
    )

    # Remove markdown JSON formatting if returned
    if content.startswith("```"):

        content = content.replace(
            "```json",
            ""
        )

        content = content.replace(
            "```",
            ""
        )

        content = content.strip()

    return json.loads(
        content
    )