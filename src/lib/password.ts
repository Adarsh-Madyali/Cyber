import zxcvbn from "zxcvbn";

export interface PasswordRule {
  id: string;
  label: string;
  passed: boolean;
}

export interface SecurityLevel {
  label: "Low Security" | "Medium Security" | "High Security" | "Excellent Security";
  tone: "destructive" | "warning" | "primary" | "success";
}

export interface AnalysisResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  tone: "destructive" | "warning" | "primary" | "success";
  crackTime: string;
  guesses: number;
  guessesLog10: number;
  entropy: number;
  security: SecurityLevel;
  rules: PasswordRule[];
  suggestions: string[];
  warning: string;
}

export const STRENGTH_LABELS = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"] as const;

const STRENGTH_TONES: AnalysisResult["tone"][] = [
  "destructive",
  "destructive",
  "warning",
  "primary",
  "success",
];

export function buildRules(password: string): PasswordRule[] {
  return [
    { id: "length", label: "At least 8 characters", passed: password.length >= 8 },
    { id: "upper", label: "Contains uppercase letters", passed: /[A-Z]/.test(password) },
    { id: "lower", label: "Contains lowercase letters", passed: /[a-z]/.test(password) },
    { id: "number", label: "Contains numbers", passed: /[0-9]/.test(password) },
    {
      id: "symbol",
      label: "Contains special characters",
      passed: /[^A-Za-z0-9]/.test(password),
    },
  ];
}

export function calculateEntropy(password: string): number {
  if (!password) return 0;
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^A-Za-z0-9]/.test(password)) pool += 33;
  if (pool === 0) return 0;
  return Math.round(password.length * Math.log2(pool) * 100) / 100;
}

export function entropyToSecurity(entropy: number): SecurityLevel {
  if (entropy < 40) return { label: "Low Security", tone: "destructive" };
  if (entropy < 60) return { label: "Medium Security", tone: "warning" };
  if (entropy < 80) return { label: "High Security", tone: "primary" };
  return { label: "Excellent Security", tone: "success" };
}

export function analyzePassword(password: string): AnalysisResult {
  const zx = zxcvbn(password);
  const score = zx.score as AnalysisResult["score"];
  const entropy = calculateEntropy(password);

  return {
    score,
    label: STRENGTH_LABELS[score],
    tone: STRENGTH_TONES[score],
    crackTime: String(
      zx.crack_times_display.offline_slow_hashing_1e4_per_second,
    ),
    guesses: zx.guesses,
    guessesLog10: Math.round(zx.guesses_log10 * 100) / 100,
    entropy,
    security: entropyToSecurity(entropy),
    rules: buildRules(password),
    suggestions: zx.feedback.suggestions ?? [],
    warning: zx.feedback.warning ?? "",
  };
}

export interface GeneratorOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/",
};

function secureRandomInt(max: number): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}

export function generatePassword(opts: GeneratorOptions): string {
  let pool = "";
  const required: string[] = [];
  if (opts.uppercase) {
    pool += CHARSETS.uppercase;
    required.push(CHARSETS.uppercase[secureRandomInt(CHARSETS.uppercase.length)]);
  }
  if (opts.lowercase) {
    pool += CHARSETS.lowercase;
    required.push(CHARSETS.lowercase[secureRandomInt(CHARSETS.lowercase.length)]);
  }
  if (opts.numbers) {
    pool += CHARSETS.numbers;
    required.push(CHARSETS.numbers[secureRandomInt(CHARSETS.numbers.length)]);
  }
  if (opts.symbols) {
    pool += CHARSETS.symbols;
    required.push(CHARSETS.symbols[secureRandomInt(CHARSETS.symbols.length)]);
  }
  if (!pool) return "";

  const chars: string[] = [...required];
  for (let i = chars.length; i < opts.length; i++) {
    chars.push(pool[secureRandomInt(pool.length)]);
  }
  // shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.slice(0, opts.length).join("");
}

/* ---------- History persistence (no raw passwords) ---------- */

export interface HistoryEntry {
  id: string;
  score: number;
  entropy: number;
  securityLabel: string;
  date: string;
}

const HISTORY_KEY = "securepass.history";

export function loadHistory(): HistoryEntry[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveHistoryEntry(result: AnalysisResult): HistoryEntry[] {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    score: result.score,
    entropy: result.entropy,
    securityLabel: result.security.label,
    date: new Date().toISOString(),
  };
  const next = [entry, ...loadHistory()].slice(0, 50);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota errors */
  }
  return next;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    /* ignore */
  }
}
