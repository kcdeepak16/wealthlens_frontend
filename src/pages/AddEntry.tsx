import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { BarChart2, Check, X } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import DatePicker from "@/components/DatePicker";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useAccounts } from "@/hooks/useAccounts";
import { useCreateSnapshot } from "@/hooks/useSnapshot";
import { formatDate, formatINR, toISODate } from "@/lib/format";
import type { SnapshotCreate } from "@/types";

export default function AddEntry() {
  const navigate = useNavigate();
  const query = useAccounts();
  const create = useCreateSnapshot();
  const [date, setDate] = useState(toISODate(new Date()));
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const accounts = useMemo(() => (query.data ?? []).filter((account) => account.consider_for_networth), [query.data]);
  const filled = accounts.filter((account) => values[`account-${account.id}`]?.trim()).length;
  const complete = accounts.length > 0 && filled === accounts.length;

  if (query.isLoading) return <Page><LoadingSkeleton /></Page>;
  if (query.isError) return <Page><EmptyState message="Could not load accounts." /></Page>;
  if (saved) return <div className="min-h-screen bg-[#0e0e10] flex flex-col items-center justify-center px-4">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10"><Check size={28} className="text-[#22c55e]" /></div>
    <h1 className="text-xl font-mono font-semibold text-[#e4e6ea]">Snapshot Saved</h1><p className="mt-1 text-sm font-mono text-[#9ca3af]">{formatDate(date)}</p>
    <button onClick={() => navigate("/overview")} className="mt-8 min-h-[48px] rounded-xl bg-[#6c63ff] px-6 text-sm font-semibold text-white">Back to Overview</button>
  </div>;

  const submit = () => {
    const payload: SnapshotCreate = {
      date_of_entry: date,
      accounts: accounts.map((account) => ({
        account_id: account.id,
        current_value: Number(values[`account-${account.id}`]),
        metric_entries: account.metrics.flatMap((metric) => {
          const value = values[`metric-${metric.id}`];
          return value?.trim() ? [{ metric_id: metric.id, value: Number(value) }] : [];
        }),
      })),
    };
    create.mutate(payload, {
      onSuccess: () => setSaved(true),
      onError: (error) => {
        const status = error instanceof AxiosError ? error.response?.status : undefined;
        toast.error(status === 409 || status === 422 ? "A snapshot already exists for this date." : "Could not save snapshot.");
      },
    });
  };

  return <Page>
    <header className="flex items-center justify-between pt-6 pb-4">
      <div><p className="text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">Biweekly Ritual</p><h1 className="text-lg font-semibold text-[#e4e6ea]">New Snapshot</h1></div>
      <div className="flex items-center gap-2"><span className="text-[10px] font-mono text-[#9ca3af]">{filled}/{accounts.length}</span><button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#3a3d44] bg-[#1b1c1f]"><X size={16} /></button></div>
    </header>
    <div className="mb-5"><p className="mb-1 text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">Snapshot Date</p><DatePicker value={date} onChange={setDate} /></div>
    {!accounts.length ? <EmptyState message="Add at least one net worth account before saving a snapshot." /> : <div className="space-y-2 pb-24">{accounts.map((account) => <section key={account.id} className="wl-card p-3">
      <div className="mb-1 flex items-center justify-between"><p className="text-sm font-medium text-[#e4e6ea]">{account.name}</p><span className="text-[10px] font-mono text-[#9ca3af]">Last: {account.current_value == null ? "—" : formatINR(account.current_value, true)}</span></div>
      <div className="flex items-center gap-2"><span className="font-mono text-[#9ca3af]">₹</span><input aria-label={`${account.name} current value`} type="number" step="0.01" value={values[`account-${account.id}`] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [`account-${account.id}`]: event.target.value }))}
        className="min-h-[44px] flex-1 border-b border-[#3a3d44] bg-transparent text-base font-mono text-[#e4e6ea] outline-none focus:border-[#6c63ff]" placeholder="0.00" /></div>
      {account.metrics.length > 0 && <div className="mt-3 space-y-2 border-t border-[#3a3d44] pt-3"><p className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-[#6c63ff]"><BarChart2 size={11} />Optional Metrics</p>
        {account.metrics.map((metric) => <label key={metric.id} className="flex items-center gap-2"><span className="w-32 truncate text-[10px] font-mono text-[#9ca3af]">{metric.name}</span><span className="text-xs font-mono text-[#9ca3af]">{metric.is_percentage ? "%" : "₹"}</span>
          <input aria-label={metric.name} type="number" step="any" value={values[`metric-${metric.id}`] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [`metric-${metric.id}`]: event.target.value }))}
            className="min-h-[40px] flex-1 border-b border-[#3a3d44] bg-transparent text-base font-mono text-[#e4e6ea] outline-none focus:border-[#6c63ff]" />
        </label>)}</div>}
    </section>)}</div>}
    <div className="fixed bottom-16 left-0 right-0 z-40 px-4"><div className="mx-auto max-w-xl"><button onClick={submit} disabled={!complete || create.isPending} className="min-h-[54px] w-full rounded-xl bg-[#6c63ff] font-semibold text-white shadow-[0_4px_24px_rgba(108,99,255,0.4)] disabled:border disabled:border-[#3a3d44] disabled:bg-[#1b1c1f] disabled:text-[#9ca3af] disabled:shadow-none">
      {create.isPending ? "Saving..." : complete ? `Save Snapshot · ${formatDate(date)}` : `${accounts.length - filled} account${accounts.length - filled === 1 ? "" : "s"} remaining`}
    </button></div></div>
  </Page>;
}
function Page({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0e0e10] pb-20"><main className="mx-auto max-w-xl px-4">{children}</main><BottomNav /></div>;
}
