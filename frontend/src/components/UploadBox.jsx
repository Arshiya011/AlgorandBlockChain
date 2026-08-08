import { useState } from "react";
import { analyzeContract } from "../services/api";

export default function UploadBox({
  onAnalysisStart,
  onAnalysisComplete,
  onAnalysisError,
}) {
  const [file, setFile] = useState(null);

  const handleFile = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please select a PDF first.");
      return;
    }

    try {
      onAnalysisStart();

      const result = await analyzeContract(file);
      console.log("Backend result:", result);

      onAnalysisComplete(result);
    } catch (error) {
      console.error("Analyze error:", error);

      const message =
        error.response?.data?.detail ||
        error.message ||
        "Contract analysis failed.";

      onAnalysisError(message);
    }
  };

  return (
    <div className="w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-900/70 backdrop-blur-md p-10 shadow-2xl">
      <div className="flex flex-col items-center">

        <div className="text-6xl mb-5">
          ☁️
        </div>

        <h2 className="text-3xl font-bold text-white">
          Upload Contract
        </h2>

        <p className="mt-3 text-slate-400 text-center">
          Drag & drop your legal agreement or choose a PDF file.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          PDF only • Maximum 10 MB
        </p>

        <label className="mt-8 cursor-pointer rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 transition">
          Browse Files

          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFile}
          />
        </label>

        {file && (
          <p className="mt-6 text-cyan-300">
            📄 {file.name}
          </p>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!file}
          className="mt-8 rounded-xl bg-emerald-500 px-8 py-3 font-bold text-white hover:bg-emerald-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ⚡ Analyze Contract
        </button>

      </div>
    </div>
  );
}