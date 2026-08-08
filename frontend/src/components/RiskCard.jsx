export default function RiskCard({ item, index }) {

  const risk = item.risk_level?.toLowerCase();

  const styles = {
    high: "border-red-500/30 bg-red-500/10 text-red-300",
    medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  };

  const icons = {
    high: "🔴",
    medium: "🟡",
    low: "🟢",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-semibold text-white">
          Clause {index + 1}
        </h3>

        <span
          className={`rounded-full border px-3 py-1 text-sm font-semibold ${
            styles[risk] || styles.low
          }`}
        >
          {icons[risk] || "⚪"} {item.risk_level}
        </span>

      </div>

      <p className="mt-5 whitespace-pre-line text-slate-300">
        {item.clause}
      </p>

      <div className="mt-5 rounded-xl bg-slate-950 p-4">

        <p className="text-sm font-semibold text-cyan-400">
          Why this is risky
        </p>

        <p className="mt-2 text-sm text-slate-400">
          {item.reason}
        </p>

      </div>

      <div className="mt-4 rounded-xl bg-slate-950 p-4">

        <p className="text-sm font-semibold text-emerald-400">
          Safer Alternative
        </p>

        <p className="mt-2 text-sm text-slate-400">
          {item.suggestion}
        </p>

      </div>

    </div>
  );
}