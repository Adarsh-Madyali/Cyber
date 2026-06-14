import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCw, KeyRound, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  generatePassword,
  analyzePassword,
  type GeneratorOptions,
} from "@/lib/password";
import { ToneBar, type Tone } from "@/components/password/tone";

export const Route = createFileRoute("/generator")({
  head: () => ({
    meta: [
      { title: "Password Generator — SecurePass Analyzer" },
      {
        name: "description",
        content:
          "Generate cryptographically secure random passwords with full control over length and character sets.",
      },
    ],
  }),
  component: GeneratorPage,
});

const toggles: { key: keyof Omit<GeneratorOptions, "length">; label: string }[] = [
  { key: "uppercase", label: "Uppercase (A-Z)" },
  { key: "lowercase", label: "Lowercase (a-z)" },
  { key: "numbers", label: "Numbers (0-9)" },
  { key: "symbols", label: "Symbols (!@#$)" },
];

function GeneratorPage() {
  const [opts, setOpts] = useState<GeneratorOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [passwords, setPasswords] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);

  const regenerate = useCallback(() => {
    if (!opts.uppercase && !opts.lowercase && !opts.numbers && !opts.symbols) {
      setPasswords([]);
      return;
    }
    setPasswords(Array.from({ length: count }, () => generatePassword(opts)));
  }, [opts, count]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const copy = async (pw: string) => {
    try {
      await navigator.clipboard.writeText(pw);
      setCopied(pw);
      toast.success("Password copied to clipboard");
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error("Could not access clipboard");
    }
  };

  const noneSelected =
    !opts.uppercase && !opts.lowercase && !opts.numbers && !opts.symbols;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Password Generator</h1>
        <p className="mt-1 text-muted-foreground">
          Create strong, random passwords using the Web Crypto API — right in your browser.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        {/* Controls */}
        <div className="animate-fade-up rounded-2xl border border-border/70 bg-gradient-surface p-6 shadow-card">
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-sm">Length</Label>
              <span className="font-mono text-lg font-semibold text-primary">{opts.length}</span>
            </div>
            <Slider
              min={8}
              max={32}
              step={1}
              value={[opts.length]}
              onValueChange={([v]) => setOpts((o) => ({ ...o, length: v }))}
            />
          </div>

          <div className="space-y-3">
            {toggles.map((t) => (
              <div
                key={t.key}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-4 py-3"
              >
                <Label htmlFor={t.key} className="cursor-pointer text-sm">
                  {t.label}
                </Label>
                <Switch
                  id={t.key}
                  checked={opts[t.key]}
                  onCheckedChange={(c) => setOpts((o) => ({ ...o, [t.key]: c }))}
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-sm">How many to generate</Label>
              <span className="font-mono text-lg font-semibold text-primary">{count}</span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[count]}
              onValueChange={([v]) => setCount(v)}
            />
          </div>

          {noneSelected && (
            <p className="mt-4 text-sm text-destructive">Select at least one character set.</p>
          )}

          <Button
            onClick={regenerate}
            disabled={noneSelected}
            className="mt-6 w-full bg-gradient-cyber text-primary-foreground shadow-glow"
          >
            <RefreshCw className="h-4 w-4" /> Regenerate
          </Button>
        </div>

        {/* Output */}
        <div className="space-y-3">
          {passwords.length === 0 ? (
            <div className="flex h-full min-h-40 items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center text-muted-foreground">
              <span>
                <KeyRound className="mx-auto mb-2 h-8 w-8 opacity-60" />
                No password — enable a character set.
              </span>
            </div>
          ) : (
            passwords.map((pw, i) => {
              const res = analyzePassword(pw);
              const pct = ((res.score + 1) / 5) * 100;
              return (
                <div
                  key={`${pw}-${i}`}
                  className="animate-fade-up rounded-xl border border-border/70 bg-gradient-surface p-4 shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <code className="flex-1 break-all font-mono text-sm">{pw}</code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copy(pw)}
                      aria-label="Copy password"
                    >
                      {copied === pw ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <ToneBar value={pct} tone={res.tone as Tone} className="h-1.5" />
                    <span className="shrink-0 text-xs text-muted-foreground">{res.label}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
