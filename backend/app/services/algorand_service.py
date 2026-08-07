import os

from algosdk.v2client import algod
from algosdk import mnemonic
from algosdk.transaction import PaymentTxn


ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

algod_client = algod.AlgodClient(
    ALGOD_TOKEN,
    ALGOD_ADDRESS
)


def store_hash_on_algorand(report_hash: str):

    sender_address = os.getenv("ALGORAND_ADDRESS")
    wallet_mnemonic = os.getenv("ALGORAND_MNEMONIC")

    if not sender_address or not wallet_mnemonic:
        raise Exception(
            "Algorand wallet environment variables are missing."
        )

    private_key = mnemonic.to_private_key(
        wallet_mnemonic
    )

    params = algod_client.suggested_params()

    note = f"ContractRiskTagger:{report_hash}".encode()

    txn = PaymentTxn(
        sender=sender_address,
        sp=params,
        receiver=sender_address,
        amt=0,
        note=note
    )

    signed_txn = txn.sign(
        private_key
    )

    txid = algod_client.send_transaction(
        signed_txn
    )

    confirmation = algod_client.pending_transaction_info(
        txid
    )

    return {
        "transaction_id": txid,
        "network": "Algorand TestNet",
        "hash": report_hash,
        "confirmation": confirmation
    }