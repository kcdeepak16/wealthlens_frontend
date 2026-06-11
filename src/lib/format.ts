export function formatINR(value: number, compact = false): string {
  const abs = Math.abs(value);
  if (compact && abs >= 10_000_000) return `${value < 0 ? "-" : ""}₹${(abs / 10_000_000).toFixed(2)}Cr`;
  if (compact && abs >= 100_000) return `${value < 0 ? "-" : ""}₹${(abs / 100_000).toFixed(2)}L`;
  if (compact && abs >= 1_000) return `${value < 0 ? "-" : ""}₹${(abs / 1_000).toFixed(1)}K`;
  if (compact) return `${value < 0 ? "-" : ""}₹${abs.toFixed(0)}`;
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(value);
}
export function formatDelta(current: number | null, previous: number | null) {
  if (current === null || previous === null) return { text: "—", positive: false, neutral: true };
  const delta = current - previous;
  const pct = previous !== 0 ? ((delta / Math.abs(previous)) * 100).toFixed(1) : "0.0";
  return {
    text: `${delta >= 0 ? "+" : "-"}${formatINR(Math.abs(delta), true)} (${delta >= 0 ? "+" : ""}${pct}%)`,
    positive: delta >= 0, neutral: delta === 0,
  };
}
export const formatDate = (isoDate: string) => new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-IN", {
  day: "numeric", month: "short", year: "numeric",
});
export const formatShortDate = (isoDate: string) => new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-IN", {
  day: "numeric", month: "short",
});
export const toISODate = (value: Date) => {
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
};
