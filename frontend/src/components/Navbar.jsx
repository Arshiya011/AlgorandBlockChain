import WalletButton from "./WalletButton";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-950/80 border-b border-slate-800">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        <div>

          <h1 className="text-2xl font-bold text-cyan-400">

            🛡 Contract Risk Tagger

          </h1>

          <p className="text-sm text-slate-400 mt-1">

            AI • Algorand • x402

          </p>

        </div>

        <WalletButton />

      </div>

    </nav>
  );
}