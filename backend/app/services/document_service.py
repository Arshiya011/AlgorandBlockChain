from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def is_contract(text: str):

    prompt = f"""
You are a legal document classifier.

Determine whether the following document is primarily a legal contract or agreement.

Return ONLY JSON.

{{
    "is_contract": true,
    "document_type":"Employment Agreement"
}}

OR

{{
    "is_contract": false,
    "document_type":"Resume"
}}

Document:

{text[:4000]}
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

    content = response.choices[0].message.content.strip()

    if content.startswith("```"):
        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()

    return json.loads(content)