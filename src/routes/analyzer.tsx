import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FileDown, Save, ShieldCheck, History, Trash2 } from "lucide-react";
import { PasswordInput } from "@/components/password/PasswordInput";
import { StrengthMeter } from "@/components/password/StrengthMeter";
import { SecurityChecks } from "@/components/password/SecurityChecks";
import { EntropyMeter } from "@/components/password/EntropyMeter";
import { Recommendations } from "@/components/password/Recommendations";
import { Button } from "@/components/ui/button";
import {
  analyzePassword,
  saveHistoryEntry,
  loadHistory,
  clearHistory,
  type AnalysisResult,
  type HistoryEntry,
} from "@/lib/password";
import { exportAnalysisReport } from "@/lib/report";

export const Route = createFileRoute("/analyzer")({
  head: () => ({
    meta: [
      { title: "Password Analyzer — SecurePass Analyzer" },
      {
        name: "description",
        content:
          "Analyze password strength, entropy, crack time and security checks in real time, fully on-device.",
      },
    ],
  }),
  component: AnalyzerPage,
});

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-up rounded-2xl border border-border/70 bg-gradient-surface p-6 shadow-card">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </h2>
      {children}
    </div>
  );
}

function AnalyzerPage() {
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());

  const result: AnalysisResult | null = useMemo(
    () => (password ? analyzePassword(password) : null),
    [password],
  );

  const handleSave = () => {
    if (!result) return;
    setHistory(saveHistoryEntry(result));
    toast.success("Analysis saved to history (password not stored)");
  };

  const handleExport = () => {
    if (!result) return;
    exportAnalysisReport(result);
    toast.success("Opening printable PDF report…");
  };

  const handleClear = () => {
    clearHistory();
    setHistory([]);
    toast("History cleared");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Password Analyzer</h1>
        <p className="mt-1 text-muted-foreground">
          Type a password to see live strength, entropy and security analysis. Nothing is sent
          anywhere.
        </p>
      </div>

      <div className="mb-6">
        <PasswordInput value={password} onChange={setPassword} />
        {result && (
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={handleSave} variant="secondary">
              <Save className="h-4 w-4" /> Save to history
            </Button>
            <Button onClick={handleExport} variant="outline">
              <FileDown className="h-4 w-4" /> Export PDF report
            </Button>
          </div>
        )}
      </div>

      {!result ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-16 text-center text-muted-foreground">
          <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-muted-foreground/60" />
          Enter a password above to begin the analysis.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Strength" icon={ShieldCheck}>
            <StrengthMeter result={result} />
          </Panel>
          <Panel title="Entropy" icon={ShieldCheck}>
            <EntropyMeter entropy={result.entropy} security={result.security} />
          </Panel>
          <Panel title="Security checks" icon={ShieldCheck}>
            <SecurityChecks rules={result.rules} />
          </Panel>
          <Panel title="Recommendations" icon={ShieldCheck}>
            <Recommendations warning={result.warning} suggestions={result.suggestions} />
          </Panel>
        </div>
      )}

      {/* History */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <History className="h-5 w-5 text-primary" /> Recent analyses
          </h2>
          {history.length > 0 && (
            <Button onClick={handleClear} variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No saved analyses yet. We only store the score, entropy and date — never the password.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/70">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Entropy</th>
                  <th className="px-4 py-3">Security</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-t border-border/60">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(h.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono">{h.score}/4</td>
                    <td className="px-4 py-3 font-mono">{h.entropy.toFixed(1)} bits</td>
                    <td className="px-4 py-3">{h.securityLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
