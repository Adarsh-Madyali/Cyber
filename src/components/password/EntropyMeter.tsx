import { ShieldAlert } from "lucide-react";
import { ToneBar, toneText, type Tone } from "./tone";
import type { SecurityLevel } from "@/lib/password";

export function EntropyMeter({
  entropy,
  security,
}: {
  entropy: number;
  security: SecurityLevel;
}) {
  // map entropy 0-128 bits to a 0-100 visual scale
  const pct = Math.min(100, (entropy / 128) * 100);
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Entropy</p>
          <p className="font-mono text-3xl font-semibold">
            {entropy.toFixed(1)}
            <span className="ml-1 text-base font-normal text-muted-foreground">bits</span>
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-current/30 px-3 py-1 text-sm font-medium ${toneText[security.tone as Tone]}`}
        >
          <ShieldAlert className="h-4 w-4" />
          {security.label}
        </span>
      </div>
      <ToneBar value={pct} tone={security.tone as Tone} />
      <div className="flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
        <span>Excellent</span>
      </div>
    </div>
  );
}
