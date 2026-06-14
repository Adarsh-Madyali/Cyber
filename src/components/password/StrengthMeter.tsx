import { ToneBar, toneText, type Tone } from "./tone";
import type { AnalysisResult } from "@/lib/password";

export function StrengthMeter({ result }: { result: AnalysisResult }) {
  const pct = ((result.score + 1) / 5) * 100;
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Strength</p>
          <p className={`text-3xl font-semibold ${toneText[result.tone as Tone]}`}>
            {result.label}
          </p>
        </div>
        <p className="font-mono text-2xl text-muted-foreground">{result.score}/4</p>
      </div>
      <ToneBar value={pct} tone={result.tone as Tone} className="h-3" />
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Crack time (offline)" value={result.crackTime} />
        <Stat label="Guesses needed" value={`10^${result.guessesLog10}`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 px-3 py-2.5">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate font-mono text-sm font-medium" title={value}>
        {value}
      </p>
    </div>
  );
}
