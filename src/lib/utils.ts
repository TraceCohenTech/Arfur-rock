export function parseMoney(raw: string): number | null {
  if (!raw || raw.trim() === "") return null;
  const cleaned = raw.replace(/[^0-9.BMKbmk]/g, "");
  const match = cleaned.match(/^([\d.]+)\s*(B|M|K)?/i);
  if (!match) return null;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return null;
  const suffix = (match[2] || "").toUpperCase();
  if (suffix === "B") return num * 1_000_000_000;
  if (suffix === "M") return num * 1_000_000;
  if (suffix === "K") return num * 1_000;
  return num;
}

export function parseDate(raw: string): Date | null {
  if (!raw || raw.trim() === "") return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  return d;
}

export function formatDate(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMoney(raw: string): string {
  if (!raw || raw.trim() === "") return "—";
  return raw;
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export function scopeLabel(scope: string): string {
  switch (scope) {
    case "called_vs_announced":
      return "Called vs Announced";
    case "rumor_unconfirmed":
      return "Rumor";
    case "market_datapoint":
      return "Market Datapoint";
    default:
      return scope;
  }
}

export function scopeColor(scope: string): string {
  switch (scope) {
    case "called_vs_announced":
      return "bg-amber-100 text-amber-800";
    case "rumor_unconfirmed":
      return "bg-violet-100 text-violet-800";
    case "market_datapoint":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}
