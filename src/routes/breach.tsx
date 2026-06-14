import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert, ShieldCheck, Search, AlertTriangle, Info } from "lucide-react";
import { PasswordInput } from "@/components/password/PasswordInput";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/breach")({
  head: () => ({
    meta: [
      { title: "Breach Check (Simulation) — SecurePass Analyzer" },
      {
        name: "description",
        content:
          "An educational, fully on-device breach exposure simulation that flags commonly leaked passwords.",
      },
    ],
  }),
  component: BreachPage,
});

// Small embedded list of well-known leaked passwords (educational simulation).
const COMMON_LEAKED = new Set([
  "123456",
  "123456789",
  "password",
  "qwerty",
  "abc123",
  "111111",
  "12345678",
  "password1",
  "12345",
  "iloveyou",
  "admin",
  "welcome",
  "monkey",
  "dragon",
  "letmein",
  "football",
  "sunshine",
  "princess",
  "qwerty123",
  "1q2w3e4r",
]);

interface BreachResult {
  breached: boolean;
  count: number;
  reason: string;
}

function simulateBreach(pw: string): BreachResult {
  const lower = pw.toLowerCase();
  if (COMMON_LEAKED.has(lower)) {
    // deterministic large pseudo-count
    let h = 0;
    for (let i = 0; i < lower.length; i++) h = (h * 31 + lower.charCodeAt(i)) % 9_000_000;
    return {
      breached: true,
      count: 500_000 + h,
      reason: "This password appears on well-known leaked-password lists.",
    };
  }
  if (pw.length < 8 || /^[a-z]+$/.test(lower) || /^\d+$/.test(pw)) {
    let h = 0;
    for (let i = 0; i < pw.length; i++) h = (h * 17 + pw.charCodeAt(i)) % 40_000;
    return {
      breached: true,
      count: 100 + h,
      reason: "Simple patterns like this are frequently found in real breaches.",
    };
  }
  return {
    breached: false,
    count: 0,
    reason: "No match found in the simulated breach dataset.",
  };
}

function BreachPage() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<BreachResult | null>(null);

  const run = () => {
    if (!password) return;
    setResult(simulateBreach(password));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Breach Exposure Check</h1>
        <p className="mt-1 text-muted-foreground">
          Check whether a password resembles credentials commonly found in data breaches.
        </p>
      </div>

      <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>
          This is an <strong>offline simulation</strong> for awareness only. It runs entirely in your
          browser using a small embedded list — no password is ever sent to any server.
        </span>
      </div>

      <div className="rounded-2xl border border-border/70 bg-gradient-surface p-6 shadow-card">
        <PasswordInput
          value={password}
          onChange={(v) => {
            setPassword(v);
            setResult(null);
          }}
          placeholder="Enter a password to check…"
        />
        <Button
          onClick={run}
          disabled={!password}
          className="mt-4 w-full bg-gradient-cyber text-primary-foreground shadow-glow"
        >
          <Search className="h-4 w-4" /> Check exposure
        </Button>

        {result && (
          <div
            className={`mt-6 animate-fade-up rounded-xl border p-5 ${
              result.breached
                ? "border-destructive/40 bg-destructive/10"
                : "border-success/40 bg-success/10"
            }`}
          >
            <div className="flex items-center gap-3">
              {result.breached ? (
                <ShieldAlert className="h-8 w-8 text-destructive" />
              ) : (
                <ShieldCheck className="h-8 w-8 text-success" />
              )}
              <div>
                <p className="text-lg font-semibold">
                  {result.breached ? "Potentially exposed" : "Looks safe"}
                </p>
                <p className="text-sm text-muted-foreground">{result.reason}</p>
              </div>
            </div>
            {result.breached && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-background/40 px-4 py-3 text-sm">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Simulated exposure count:{" "}
                <span className="font-mono font-semibold">
                  {result.count.toLocaleString()}
                </span>{" "}
                breaches — change it immediately.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
