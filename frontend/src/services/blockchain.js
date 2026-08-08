import algosdk from "algosdk";

export async function generateReportHash(result) {
  const text = JSON.stringify(result);

  const data = new TextEncoder().encode(text);

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  const hashArray = Array.from(
    new Uint8Array(hashBuffer)
  );

  const hashHex = hashArray
    .map((byte) =>
      byte.toString(16).padStart(2, "0")
    )
    .join("");

  return hashHex;
}

export function createAlgodClient() {
  return new algosdk.Algodv2(
    "",
    "https://testnet-api.algonode.cloud",
    ""
  );
}