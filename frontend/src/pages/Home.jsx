import { useState } from "react";

import UploadBox from "../components/UploadBox";
import RiskCard from "../components/RiskCard";
import { generateReportHash } from "../services/blockchain";


export default function Home() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [reportHash, setReportHash] = useState("");


  const startAnalysis = () => {
    setStatus("loading");
    setResult(null);
    setError("");
    setReportHash("");
  };


  const completeAnalysis = async (data) => {
    try {
      setResult(data);

      const hash = await generateReportHash(data);

      setReportHash(hash);

      setStatus("complete");
    } catch (error) {
      console.error("Hash generation failed:", error);

      setError("Analysis completed, but hash generation failed.");
      setStatus("error");
    }
  };


  const failAnalysis = (message) => {
    setError(message);
    setStatus("error");
  };


  const analysis = result?.analysis || [];


  const highCount = analysis.filter(
    (item) => item.risk_level?.toLowerCase() === "high"
  ).length;


  const mediumCount = analysis.filter(
    (item) => item.risk_level?.toLowerCase() === "medium"
  ).length;


  const lowCount = analysis.filter(
    (item) => item.risk_level?.toLowerCase() === "low"
  ).length;


  return (
    <main className="flex flex-1 flex-col items-center px-6 py-14">

      {/* Technology Badge */}
      <div className="mb-6">
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-cyan-300">
          ⚡ Powered by Groq AI • Algorand • x402
        </span>
      </div>


      {/* Hero Section */}
      <div className="relative mb-10 max-w-4xl text-center">

        <div className="pointer-events-none absolute inset-0 flex justify-center">
          <div className="h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
        </div>

        <div className="relative z-10">

          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Understand contract risks before you sign
          </h2>

          <p className="mt-4 text-slate-400">
            Upload a legal agreement and our AI will identify risky clauses,
            classify them as Low, Medium, or High risk, and suggest safer
            alternatives.
          </p>

        </div>

      </div>


      {/* Upload Section */}
      <UploadBox
        onAnalysisStart={startAnalysis}
        onAnalysisComplete={completeAnalysis}
        onAnalysisError={failAnalysis}
      />


      {/* Live Analysis Dashboard */}
      <section className="mt-12 w-full max-w-5xl">

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-2xl font-bold text-white">
                Live Analysis Dashboard
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Real-time contract risk analysis
              </p>
            </div>

            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
              ● LIVE
            </span>

          </div>


          {/* Idle State */}
          {status === "idle" && (
            <div className="py-14 text-center">

              <div className="text-5xl">
                📊
              </div>

              <h4 className="mt-4 text-xl font-semibold text-white">
                No analysis yet
              </h4>

              <p className="mt-2 text-slate-400">
                Upload a contract and click Analyze Contract to begin.
              </p>

            </div>
          )}


          {/* Loading State */}
          {status === "loading" && (
            <div className="mt-8">

              <div className="flex items-center justify-between">

                <p className="font-semibold text-cyan-300">
                  📄 Analyzing Contract...
                </p>

                <p className="text-sm text-slate-500">
                  AI Processing
                </p>

              </div>


              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">

                <div className="h-full w-3/4 animate-pulse rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"></div>

              </div>


              <div className="mt-8 grid gap-4 md:grid-cols-2">

                <div className="rounded-xl bg-slate-950 p-4 text-slate-300">
                  ✔ Extracting Text
                </div>

                <div className="rounded-xl bg-slate-950 p-4 text-slate-300">
                  ✔ Splitting Clauses
                </div>

                <div className="rounded-xl bg-slate-950 p-4 text-cyan-300">
                  ⏳ Running AI Risk Analysis
                </div>

                <div className="rounded-xl bg-slate-950 p-4 text-slate-500">
                  ○ Preparing Blockchain Verification
                </div>

              </div>

            </div>
          )}


          {/* Error State */}
          {status === "error" && (
            <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
              ⚠ {error}
            </div>
          )}


          {/* Rejected Document */}
          {status === "complete" && result?.status === "rejected" && (
            <div className="mt-8 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-6">

              <h4 className="text-xl font-semibold text-yellow-300">
                Document Rejected
              </h4>

              <p className="mt-2 text-slate-300">
                {result.message}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Detected document type: {result.document_type}
              </p>

            </div>
          )}


          {/* Successful Analysis */}
          {status === "complete" && result?.status === "success" && (
            <div className="mt-8">

              <div className="mb-8">

                <p className="text-sm text-slate-400">
                  {result.document_type}
                </p>

                <h4 className="mt-1 text-xl font-semibold text-white">
                  {result.number_of_clauses} clauses analyzed successfully
                </h4>

              </div>


              {/* Risk Counters */}
              <div className="grid gap-4 md:grid-cols-3">

                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">

                  <p className="text-sm font-medium text-red-300">
                    🔴 High Risk
                  </p>

                  <p className="mt-3 text-4xl font-bold text-white">
                    {highCount}
                  </p>

                </div>


                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">

                  <p className="text-sm font-medium text-yellow-300">
                    🟡 Medium Risk
                  </p>

                  <p className="mt-3 text-4xl font-bold text-white">
                    {mediumCount}
                  </p>

                </div>


                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">

                  <p className="text-sm font-medium text-emerald-300">
                    🟢 Low Risk
                  </p>

                  <p className="mt-3 text-4xl font-bold text-white">
                    {lowCount}
                  </p>

                </div>

              </div>


              {/* SHA-256 Hash */}
              <div className="mt-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6">

                <p className="text-sm font-semibold text-cyan-300">
                  🔐 SHA-256 Report Hash
                </p>

                <p className="mt-3 break-all font-mono text-sm text-slate-300">
                  {reportHash || "Generating hash..."}
                </p>

                {reportHash && (
                  <p className="mt-3 text-sm text-emerald-300">
                    ✓ Ready for Algorand verification
                  </p>
                )}

              </div>


              {/* Detailed Clause Results */}
              <div className="mt-8 space-y-5">

                {analysis.map((item, index) => (
                  <RiskCard
                    key={index}
                    item={item}
                    index={index}
                  />
                ))}

              </div>

            </div>
          )}

        </div>

      </section>


      {/* Technology Cards */}
      <div className="mt-12 grid w-full max-w-5xl gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

          <h3 className="font-semibold text-cyan-400">
            🤖 AI Analysis
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Detect potentially risky contract clauses.
          </p>

        </div>


        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

          <h3 className="font-semibold text-cyan-400">
            💳 x402 Protected
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Contract analysis is protected through x402 payments.
          </p>

        </div>


        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

          <h3 className="font-semibold text-cyan-400">
            🔗 Algorand Verified
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Analysis proofs are verified using Algorand.
          </p>

        </div>

      </div>

    </main>
  );
}