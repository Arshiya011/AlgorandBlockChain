import { useEffect, useState } from "react";
import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

export default function WalletButton() {
  const [walletAddress, setWalletAddress] = useState("");

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      })
      .catch((error) => {
        console.log("No previous wallet session:", error);
      });
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await peraWallet.connect();

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        console.log("Connected wallet:", accounts[0]);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await peraWallet.disconnect();
      setWalletAddress("");
    } catch (error) {
      console.error("Wallet disconnect failed:", error);
    }
  };

  return (
    <button
      onClick={walletAddress ? disconnectWallet : connectWallet}
      style={{
        backgroundColor: "#2563eb",
        color: "white",
        padding: "10px 18px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      {walletAddress
        ? `Wallet: ${shortenAddress(walletAddress)}`
        : "Connect Pera Wallet"}
    </button>
  );
}