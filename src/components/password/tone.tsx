import { cn } from "@/lib/utils";

export type Tone = "destructive" | "warning" | "primary" | "success";

export const toneText: Record<Tone, string> = {
  destructive: "text-destructive",
  warning: "text-warning",
  primary: "text-primary",
  success: "text-success",
};

export const toneBg: Record<Tone, string> = {
  destructive: "bg-destructive",
  warning: "bg-warning",
  primary: "bg-primary",
  success: "bg-success",
};

export const toneBorder: Record<Tone, string> = {
  destructive: "border-destructive/40",
  warning: "border-warning/40",
  primary: "border-primary/40",
  success: "border-success/40",
};

export function ToneBar({
  value,
  tone,
  className,
}: {
  value: number;
  tone: Tone;
  className?: string;
}) {
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", toneBg[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
