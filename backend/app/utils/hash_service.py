import hashlib
import json


def generate_report_hash(contract_text: str, analysis: list) -> str:
    payload = {
        "contract_text": contract_text,
        "analysis": analysis
    }

    normalized = json.dumps(
        payload,
        sort_keys=True,
        ensure_ascii=False
    )

    return hashlib.sha256(
        normalized.encode("utf-8")
    ).hexdigest()