import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart3, Activity, Award, Database, ShieldCheck } from "lucide-react";
import { loadHistory, STRENGTH_LABELS, type HistoryEntry } from "@/lib/password";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Security Dashboard — SecurePass Analyzer" },
      {
        name: "description",
        content:
          "Overview of analyzed passwords: totals, average strength, strongest score and security-level distribution.",
      },
    ],
  }),
  component: DashboardPage,
});

const SECURITY_ORDER = [
  "Low Security",
  "Medium Security",
  "High Security",
  "Excellent Security",
] as const;

const SECURITY_COLORS: Record<string, string> = {
  "Low Security": "var(--destructive)",
  "Medium Security": "var(--warning)",
  "High Security": "var(--primary)",
  "Excellent Security": "var(--success)",
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="animate-fade-up rounded-2xl border border-border/70 bg-gradient-surface p-6 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function DashboardPage() {
  const [history] = useState<HistoryEntry[]>(() => loadHistory());

  const stats = useMemo(() => {
    const total = history.length;
    const avg = total ? history.reduce((s, h) => s + h.score, 0) / total : 0;
    const strongest = total ? Math.max(...history.map((h) => h.score)) : 0;
    const avgEntropy = total ? history.reduce((s, h) => s + h.entropy, 0) / total : 0;

    const dist = SECURITY_ORDER.map((label) => ({
      name: label,
      value: history.filter((h) => h.securityLabel === label).length,
    })).filter((d) => d.value > 0);

    return { total, avg, strongest, avgEntropy, dist };
  }, [history]);

  if (stats.total === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/40 p-16 text-center text-muted-foreground">
          <Database className="mx-auto mb-3 h-10 w-10 opacity-60" />
          No data yet. Save some analyses on the Analyzer page to populate your dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <BarChart3 className="h-7 w-7 text-primary" /> Security Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">Aggregated metrics from your saved analyses.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Database} label="Passwords analyzed" value={String(stats.total)} />
        <StatCard
          icon={Activity}
          label="Average strength"
          value={`${stats.avg.toFixed(1)}/4`}
          sub={STRENGTH_LABELS[Math.round(stats.avg)]}
        />
        <StatCard
          icon={Award}
          label="Strongest score"
          value={`${stats.strongest}/4`}
          sub={STRENGTH_LABELS[stats.strongest]}
        />
        <StatCard
          icon={ShieldCheck}
          label="Average entropy"
          value={`${stats.avgEntropy.toFixed(0)} bits`}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="animate-fade-up rounded-2xl border border-border/70 bg-gradient-surface p-6 shadow-card">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Security level distribution
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.dist}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {stats.dist.map((d) => (
                    <Cell key={d.name} fill={SECURITY_COLORS[d.name]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            {stats.dist.map((d) => (
              <span key={d.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: SECURITY_COLORS[d.name] }}
                />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>

        <div className="animate-fade-up rounded-2xl border border-border/70 bg-gradient-surface p-6 shadow-card">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Strength breakdown
          </h2>
          <div className="space-y-3">
            {STRENGTH_LABELS.map((label, score) => {
              const n = history.filter((h) => h.score === score).length;
              const pct = stats.total ? (n / stats.total) * 100 : 0;
              return (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>{label}</span>
                    <span>{n}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-cyber transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
