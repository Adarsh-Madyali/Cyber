import { Lightbulb, AlertTriangle } from "lucide-react";

export function Recommendations({
  warning,
  suggestions,
}: {
  warning: string;
  suggestions: string[];
}) {
  if (!warning && suggestions.length === 0) {
    return (
      <p className="text-sm text-success">
        Great job — no specific recommendations. This password looks solid.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {warning && (
        <div className="flex items-start gap-2.5 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2.5 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <span>{warning}</span>
        </div>
      )}
      <ul className="space-y-2">
        {suggestions.map((s, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
