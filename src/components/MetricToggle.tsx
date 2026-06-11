export interface MetricToggleItem { key: string; label: string; color: string; }
export default function MetricToggle({ items, active, onToggle }: {
  items: MetricToggleItem[]; active: Set<string>; onToggle: (key: string) => void;
}) {
  return <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
    {items.map((item) => <button type="button" key={item.key} onClick={() => onToggle(item.key)}
      className={`min-h-[40px] shrink-0 rounded-full border px-3 text-xs font-mono ${
        active.has(item.key) ? "text-white" : "border-[#3a3d44] text-[#9ca3af]"
      }`} style={active.has(item.key) ? { backgroundColor: item.color, borderColor: item.color } : undefined}>{item.label}</button>)}
  </div>;
}
