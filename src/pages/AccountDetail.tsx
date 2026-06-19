import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { ArrowLeft, MoreHorizontal, Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import AccountFormSheet from "@/components/AccountFormSheet";
import BottomNav from "@/components/BottomNav";
import ConfirmSheet from "@/components/ConfirmSheet";
import EmptyState from "@/components/EmptyState";
import IndividualEntrySheet from "@/components/IndividualEntrySheet";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import MetricToggle from "@/components/MetricToggle";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useAccount, useAccountChartData, useAccountEntries, useDeleteAccount, useUpdateAccount } from "@/hooks/useAccounts";
import { useCreateIndividualEntry, useDeleteEntry, useUpdateEntry } from "@/hooks/useSnapshot";
import { formatDate, formatDelta, formatINR, formatShortDate } from "@/lib/format";
import { ACCOUNT_TYPE_LABELS, type TimeRange } from "@/types";

const SERIES_COLORS = ["#6c63ff", "#22c55e", "#f59e0b", "#06b6d4", "#ec4899", "#f97316"];

export default function AccountDetail() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const [range, setRange] = useState<TimeRange>("1y");
  const accountQuery = useAccount(id);
  const entriesQuery = useAccountEntries(id);
  const chartQuery = useAccountChartData(id, range);
  const update = useUpdateAccount();
  const removeAccount = useDeleteAccount();
  const removeEntry = useDeleteEntry(id);
  const createEntry = useCreateIndividualEntry(id);
  const updateEntry = useUpdateEntry(id);
  const [active, setActive] = useState(new Set(["value"]));
  const [menu, setMenu] = useState(false);
  const [edit, setEdit] = useState(false);
  const [addEntry, setAddEntry] = useState(false);
  const [editEntry, setEditEntry] = useState<null | any>(null);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (chartQuery.data) setActive((current) => new Set([...current].filter((key) => key === "value" || chartQuery.data!.metric_series.some((metric) => key === `metric-${metric.metric_id}`))));
  }, [chartQuery.data]);
  const chartRows = useMemo(() => {
    const data = chartQuery.data;
    if (!data) return [];
    return data.value_series.map((point, index) => {
      const row: Record<string, string | number | null> = { date: point.date, value: point.value };
      data.metric_series.forEach((metric) => { row[`metric-${metric.metric_id}`] = metric.data[index]?.value ?? null; });
      return row;
    });
  }, [chartQuery.data]);

  if (accountQuery.isLoading || entriesQuery.isLoading || chartQuery.isLoading) return <Page><LoadingSkeleton /></Page>;
  if (accountQuery.isError || !accountQuery.data) return <Page><EmptyState message="Account not found." /></Page>;
  const account = accountQuery.data;
  const chart = chartQuery.data!;
  const delta = formatDelta(account.current_value, account.previous_value);
  const toggles = [{ key: "value", label: "Value", color: SERIES_COLORS[0] }, ...chart.metric_series.map((metric, index) => ({ key: `metric-${metric.metric_id}`, label: metric.metric_name, color: SERIES_COLORS[(index + 1) % SERIES_COLORS.length] }))];
  const showPercentageAxis = chart.metric_series.some((metric) => metric.is_percentage && active.has(`metric-${metric.metric_id}`));

  return <Page>
    <header className="flex items-center justify-between pt-6 pb-4">
      <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#3a3d44] bg-[#1b1c1f]"><ArrowLeft size={18} /></button>
      <span className="max-w-[70%] truncate text-sm font-medium text-[#e4e6ea]">{account.name}</span>
      <button onClick={() => setMenu(true)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#3a3d44] bg-[#1b1c1f]"><MoreHorizontal size={18} /></button>
    </header>
    <div className="mb-4"><div className="mb-2 flex gap-2"><span className="rounded border border-[#3a3d44] bg-[#21222a] px-2 py-1 text-[9px] font-mono uppercase text-[#9ca3af]">{ACCOUNT_TYPE_LABELS[account.type]}</span>{!account.consider_for_networth && <span className="rounded border border-[#3a3d44] px-2 py-1 text-[9px] font-mono uppercase text-[#9ca3af]">Excluded</span>}</div>
      <div className="flex flex-wrap items-end gap-3"><h1 className="text-4xl font-mono font-semibold text-[#e4e6ea]">{formatINR(account.current_value ?? 0)}</h1><span className={`mb-1 flex items-center gap-1 text-sm font-mono ${delta.neutral ? "text-[#9ca3af]" : delta.positive ? "text-[#22c55e]" : "text-[#ef4444]"}`}>{!delta.neutral && (delta.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />)}{delta.text}</span></div>
    </div>
    <div className="mb-3 flex items-center justify-between gap-2"><p className="text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">History</p><TimeRangeSelector selected={range} onChange={setRange} /></div>
    <MetricToggle items={toggles} active={active} onToggle={(key) => setActive((current) => { const next = new Set(current); next.has(key) ? next.delete(key) : next.add(key); return next; })} />
    <section className="wl-card mt-2 mb-4 p-3">
      {chartRows.length ? <><ResponsiveContainer width="100%" height={190}><LineChart data={chartRows}><CartesianGrid strokeDasharray="3 3" stroke="#3a3d44" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="value" tickFormatter={(value) => formatINR(value, true)} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={58} />
        {showPercentageAxis && <YAxis yAxisId="percent" orientation="right" tickFormatter={(value) => `${value}%`} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={38} />}
        <Tooltip labelFormatter={(label) => formatDate(String(label))} contentStyle={{ background: "#1b1c1f", border: "1px solid #3a3d44", borderRadius: 8 }} />
        {active.has("value") && <Line yAxisId="value" type="monotone" dataKey="value" name="Value" stroke={SERIES_COLORS[0]} strokeWidth={2} dot={false} connectNulls={false} />}
        {chart.metric_series.map((metric, index) => active.has(`metric-${metric.metric_id}`) && <Line key={metric.metric_id} yAxisId={metric.is_percentage ? "percent" : "value"} type="monotone" dataKey={`metric-${metric.metric_id}`} name={metric.metric_name} stroke={SERIES_COLORS[(index + 1) % SERIES_COLORS.length]} strokeWidth={1.8} dot={false} connectNulls={false} />)}
      </LineChart></ResponsiveContainer>
      <div className="mt-2 flex flex-wrap gap-3">{toggles.filter((item) => active.has(item.key)).map((item) => <span key={item.key} className="flex items-center gap-1 text-[10px] font-mono text-[#9ca3af]"><span className="h-2 w-2 rounded-full" style={{ background: item.color }} />{item.label}</span>)}</div></> : <EmptyState message="No entries in this range." />}
    </section>

    <div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">Entry Log</p>{!account.consider_for_networth && <button onClick={() => setAddEntry(true)} className="flex min-h-[44px] items-center gap-1 text-xs font-medium text-[#6c63ff]"><Plus size={14} />Add Entry</button>}</div>
    {(entriesQuery.data?.length ?? 0) ? <section className="wl-card mb-4 overflow-hidden">{entriesQuery.data!.map((entry, index, list) => <div key={entry.id}
      onClick={() => setEditEntry(entry)}
      onPointerDown={() => { pressTimer.current = setTimeout(() => setEntryToDelete(entry.id), 650); }} onPointerUp={() => pressTimer.current && clearTimeout(pressTimer.current)} onPointerLeave={() => pressTimer.current && clearTimeout(pressTimer.current)}
      className={`flex min-h-[64px] items-center gap-3 px-3 ${index < list.length - 1 ? "border-b border-[#3a3d44]" : ""}`}>
      <div className="min-w-0 flex-1"><p className="text-xs font-mono text-[#9ca3af]">{formatDate(entry.date_of_entry)}</p><div className="mt-1 flex flex-wrap gap-2">{entry.metric_entries.map((value) => {
        const metric = account.metrics.find((item) => item.id === value.metric_id); return <span key={value.id} className="text-[9px] font-mono text-[#6c63ff]">{metric?.name}: {metric?.is_percentage ? `${value.value}%` : formatINR(value.value, true)}</span>;
      })}</div></div><span className="text-sm font-mono text-[#e4e6ea]">{formatINR(entry.current_value)}</span><button aria-label="Delete entry" onClick={() => setEntryToDelete(entry.id)} className="flex h-11 w-11 items-center justify-center"><Trash2 size={14} className="text-[#ef4444]" /></button>
    </div>)}</section> : <EmptyState message="No entries yet." />}

    <Drawer open={menu} onOpenChange={setMenu}><DrawerContent className="max-w-xl mx-auto bg-[#1b1c1f] border-[#3a3d44]"><div className="p-4">
      <button onClick={() => { setMenu(false); setEdit(true); }} className="min-h-[52px] w-full border-b border-[#3a3d44] text-left text-sm text-[#e4e6ea]">Edit Account</button>
      <button onClick={() => { setMenu(false); setDeleteAccountOpen(true); }} className="min-h-[52px] w-full text-left text-sm text-[#ef4444]">Delete Account</button>
    </div></DrawerContent></Drawer>
    <AccountFormSheet open={edit} onClose={() => setEdit(false)} account={account} pending={update.isPending} onSave={(data) => update.mutate({ id, data }, { onSuccess: () => { setEdit(false); toast.success("Account updated"); } })} />
    <IndividualEntrySheet open={addEntry} onClose={() => setAddEntry(false)} account={account} pending={createEntry.isPending} onSave={(data) => createEntry.mutate(data, { onSuccess: () => { setAddEntry(false); toast.success("Entry saved"); }, onError: () => toast.error("Could not save entry") })} />
    <IndividualEntrySheet open={!!editEntry} entry={editEntry ?? undefined} onClose={() => setEditEntry(null)} account={account} pending={updateEntry.isLoading} onSave={(data) => {
      if (!editEntry) return;
      updateEntry.mutate({ entryId: editEntry.id, data }, { onSuccess: () => { setEditEntry(null); toast.success("Entry updated"); }, onError: () => toast.error("Could not update entry") });
    }} />
    <ConfirmSheet isOpen={entryToDelete !== null} onClose={() => setEntryToDelete(null)} title="Delete this entry?" description="This cannot be undone." confirmLabel="Delete Entry" destructive onConfirm={() => entryToDelete && removeEntry.mutate(entryToDelete, { onSuccess: () => { setEntryToDelete(null); toast.success("Entry deleted"); } })} />
    <ConfirmSheet isOpen={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)} title="Delete this account?" description="This will permanently delete all entries for this account." confirmLabel="Delete Account" destructive onConfirm={() => removeAccount.mutate(id, { onSuccess: () => navigate("/accounts") })} />
  </Page>;
}
function Page({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0e0e10] pb-20"><main className="mx-auto max-w-xl px-4">{children}</main><BottomNav /></div>;
}
