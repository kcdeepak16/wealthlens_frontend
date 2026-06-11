import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import DatePicker from "./DatePicker";
import { toISODate } from "@/lib/format";
import type { AccountWithStats, IndividualEntryCreate } from "@/types";

export default function IndividualEntrySheet({ open, onClose, account, onSave, pending = false }: {
  open: boolean; onClose: () => void; account: AccountWithStats; onSave: (data: IndividualEntryCreate) => void; pending?: boolean;
}) {
  const [date, setDate] = useState(toISODate(new Date()));
  const [value, setValue] = useState("");
  const [metrics, setMetrics] = useState<Record<number, string>>({});
  useEffect(() => { if (open) { setDate(toISODate(new Date())); setValue(""); setMetrics({}); } }, [open]);
  return <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
    <DrawerContent className="max-w-xl mx-auto max-h-[90vh] overflow-y-auto bg-[#1b1c1f] border-[#3a3d44]">
      <DrawerHeader className="text-left"><DrawerTitle className="text-[#e4e6ea]">Add Entry</DrawerTitle></DrawerHeader>
      <div className="space-y-4 px-4 pb-6">
        <DatePicker value={date} onChange={setDate} />
        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">Current Value
          <div className="mt-1 flex items-center rounded-lg border border-[#3a3d44] bg-[#0e0e10] px-3"><span>₹</span><input type="number" step="0.01" value={value} onChange={(event) => setValue(event.target.value)} className="min-h-[44px] flex-1 bg-transparent px-2 text-base text-[#e4e6ea] outline-none" /></div>
        </label>
        {account.metrics.map((metric) => <label key={metric.id} className="block text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">{metric.name} (optional)
          <div className="mt-1 flex items-center rounded-lg border border-[#3a3d44] bg-[#0e0e10] px-3"><span>{metric.is_percentage ? "%" : "₹"}</span><input type="number" step="any" value={metrics[metric.id] ?? ""} onChange={(event) => setMetrics((current) => ({ ...current, [metric.id]: event.target.value }))} className="min-h-[44px] flex-1 bg-transparent px-2 text-base text-[#e4e6ea] outline-none" /></div>
        </label>)}
        <button disabled={!value.trim() || pending} onClick={() => onSave({
          date_of_entry: date, current_value: Number(value),
          metric_entries: account.metrics.flatMap((metric) => metrics[metric.id]?.trim() ? [{ metric_id: metric.id, value: Number(metrics[metric.id]) }] : []),
        })} className="min-h-[48px] w-full rounded-xl bg-[#6c63ff] font-semibold text-white disabled:opacity-40">{pending ? "Saving..." : "Save Entry"}</button>
      </div>
    </DrawerContent>
  </Drawer>;
}
