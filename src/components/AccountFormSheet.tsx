import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import DatePicker from "./DatePicker";
import type { AccountCreate, AccountType, AccountWithStats } from "@/types";
import { ACCOUNT_TYPE_LABELS } from "@/types";
import { toISODate } from "@/lib/format";

export default function AccountFormSheet({ open, onClose, account, onSave, pending = false }: {
  open: boolean; onClose: () => void; account?: AccountWithStats | null;
  onSave: (data: AccountCreate) => void; pending?: boolean;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("bank_account");
  const [date, setDate] = useState(toISODate(new Date()));
  const [tracked, setTracked] = useState(true);
  useEffect(() => {
    setName(account?.name ?? "");
    setType(account?.type ?? "bank_account");
    setDate(account?.date_of_start ?? toISODate(new Date()));
    setTracked(account?.consider_for_networth ?? true);
  }, [account, open]);
  return <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
    <DrawerContent className="max-w-xl mx-auto max-h-[90vh] overflow-y-auto bg-[#1b1c1f] border-[#3a3d44]">
      <DrawerHeader className="text-left"><DrawerTitle className="text-[#e4e6ea]">{account ? "Edit Account" : "Add Account"}</DrawerTitle></DrawerHeader>
      <div className="space-y-4 px-4 pb-6">
        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">Name
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full min-h-[44px] rounded-lg border border-[#3a3d44] bg-[#0e0e10] px-3 text-base text-[#e4e6ea] outline-none focus:border-[#6c63ff]" />
        </label>
        <label className="block text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">Type
          <select value={type} onChange={(event) => setType(event.target.value as AccountType)} className="mt-1 w-full min-h-[44px] rounded-lg border border-[#3a3d44] bg-[#0e0e10] px-3 text-base text-[#e4e6ea]">
            {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <div><p className="mb-1 text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">Date of Start</p><DatePicker value={date} onChange={setDate} /></div>
        <button type="button" onClick={() => setTracked((value) => !value)} className="flex min-h-[52px] w-full items-center justify-between rounded-lg border border-[#3a3d44] px-3 text-left">
          <span><span className="block text-sm text-[#e4e6ea]">Consider for Net Worth</span><span className="text-[10px] font-mono text-[#9ca3af]">Included in complete snapshots</span></span>
          <span className={`h-6 w-11 rounded-full p-1 ${tracked ? "bg-[#6c63ff]" : "bg-[#3a3d44]"}`}><span className={`block h-4 w-4 rounded-full bg-white transition-transform ${tracked ? "translate-x-5" : ""}`} /></span>
        </button>
        <button disabled={!name.trim() || pending} onClick={() => onSave({ name: name.trim(), type, date_of_start: date, consider_for_networth: tracked })}
          className="min-h-[48px] w-full rounded-xl bg-[#6c63ff] font-semibold text-white disabled:opacity-40">{pending ? "Saving..." : account ? "Save Changes" : "Add Account"}</button>
      </div>
    </DrawerContent>
  </Drawer>;
}
