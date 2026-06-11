import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { Metric, MetricCreate } from "@/types";

export default function MetricFormSheet({ open, onClose, metric, onSave, pending = false }: {
  open: boolean; onClose: () => void; metric?: Metric | null; onSave: (data: MetricCreate) => void; pending?: boolean;
}) {
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState(false);
  useEffect(() => { setName(metric?.name ?? ""); setPercentage(metric?.is_percentage ?? false); }, [metric, open]);
  return <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
    <DrawerContent className="max-w-xl mx-auto bg-[#1b1c1f] border-[#3a3d44]">
      <DrawerHeader className="text-left"><DrawerTitle className="text-[#e4e6ea]">{metric ? "Edit Metric" : "Add Metric"}</DrawerTitle></DrawerHeader>
      <div className="space-y-4 px-4 pb-6">
        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">Name
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 min-h-[44px] w-full rounded-lg border border-[#3a3d44] bg-[#0e0e10] px-3 text-base text-[#e4e6ea] outline-none focus:border-[#6c63ff]" />
        </label>
        <button onClick={() => setPercentage((value) => !value)} className="flex min-h-[52px] w-full items-center justify-between rounded-lg border border-[#3a3d44] px-3">
          <span className="text-sm text-[#e4e6ea]">Percentage value</span><span className={`h-6 w-11 rounded-full p-1 ${percentage ? "bg-[#6c63ff]" : "bg-[#3a3d44]"}`}><span className={`block h-4 w-4 rounded-full bg-white transition-transform ${percentage ? "translate-x-5" : ""}`} /></span>
        </button>
        <button disabled={!name.trim() || pending} onClick={() => onSave({ name: name.trim(), is_percentage: percentage })} className="min-h-[48px] w-full rounded-xl bg-[#6c63ff] font-semibold text-white disabled:opacity-40">{pending ? "Saving..." : metric ? "Save Changes" : "Add Metric"}</button>
      </div>
    </DrawerContent>
  </Drawer>;
}
