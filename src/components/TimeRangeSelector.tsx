import type { TimeRange } from "@/types";

const OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "3m", label: "3M" }, { value: "6m", label: "6M" }, { value: "1y", label: "1Y" },
  { value: "3y", label: "3Y" }, { value: "5y", label: "5Y" }, { value: "all", label: "All" },
];
export default function TimeRangeSelector({ selected, onChange }: { selected: TimeRange; onChange: (range: TimeRange) => void }) {
  return <div className="flex gap-1 overflow-x-auto no-scrollbar">
    {OPTIONS.map((option) => <button type="button" key={option.value} onClick={() => onChange(option.value)}
      className={`pill min-h-[36px] ${selected === option.value ? "pill-active" : ""}`}>{option.label}</button>)}
  </div>;
}
