import { Check, X } from "lucide-react";
import type { PasswordRule } from "@/lib/password";
import { cn } from "@/lib/utils";

export function SecurityChecks({ rules }: { rules: PasswordRule[] }) {
  return (
    <ul className="grid gap-2.5">
      {rules.map((rule) => (
        <li
          key={rule.id}
          className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5"
        >
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
              rule.passed
                ? "bg-success/15 text-success"
                : "bg-destructive/15 text-destructive",
            )}
          >
            {rule.passed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </span>
          <span
            className={cn(
              "text-sm",
              rule.passed ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {rule.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
