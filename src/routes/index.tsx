import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  Gauge,
  KeyRound,
  BarChart3,
  Sparkles,
  Lock,
  Cpu,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SecurePass Analyzer — Password Strength & Security Checker" },
      {
        name: "description",
        content:
          "A professional, fully client-side cybersecurity tool to analyze password strength, entropy, crack time, and generate secure passwords.",
      },
      { property: "og:title", content: "SecurePass Analyzer" },
      {
        property: "og:description",
        content: "Analyze password strength, entropy and crack time — 100% client-side.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Gauge,
    title: "Strength Meter",
    desc: "Real-time zxcvbn scoring with crack-time estimates and guess counts.",
  },
  {
    icon: Cpu,
    title: "Entropy Calculator",
    desc: "Precise bits-of-entropy with a Low → Excellent security rating.",
  },
  {
    icon: KeyRound,
    title: "Password Generator",
    desc: "Cryptographically random passwords with full character control.",
  },
  {
    icon: BarChart3,
    title: "Security Dashboard",
    desc: "Track analyses, averages and a security-level distribution chart.",
  },
  {
    icon: Eye,
    title: "Breach Simulation",
    desc: "Awareness-focused breach exposure check, run entirely on-device.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    desc: "No backend, no tracking. Passwords never leave your browser.",
  },
];

function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-40" />
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-cyber opacity-20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" /> 100% client-side · zero data collection
          </span>
          <h1
            className="mx-auto mt-6 max-w-3xl animate-fade-up text-4xl font-bold tracking-tight sm:text-6xl"
            style={{ animationDelay: "0.05s" }}
          >
            Know how strong your <span className="text-gradient-cyber">passwords</span> really are
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg text-muted-foreground"
            style={{ animationDelay: "0.1s" }}
          >
            SecurePass Analyzer measures strength, entropy and crack time, generates secure
            passwords, and tracks your security posture — all without sending a single byte to a
            server.
          </p>
          <div
            className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.15s" }}
          >
            <Button asChild size="lg" className="bg-gradient-cyber text-primary-foreground shadow-glow">
              <Link to="/analyzer">
                Analyze a password <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/generator">Generate secure password</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group animate-fade-up rounded-2xl border border-border/70 bg-gradient-surface p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/50"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-10 text-center">
          <Shield className="h-10 w-10 text-primary" />
          <h2 className="text-2xl font-semibold">Ready to audit your passwords?</h2>
          <p className="max-w-xl text-muted-foreground">
            Run an instant analysis and get actionable recommendations to harden your credentials.
          </p>
          <Button asChild size="lg" className="bg-gradient-cyber text-primary-foreground">
            <Link to="/analyzer">
              Start analyzing <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
