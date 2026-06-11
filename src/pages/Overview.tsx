import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import { useAccounts } from "@/hooks/useAccounts";
import { useNetworthHistory, useSummary } from "@/hooks/useSummary";
import { formatDate, formatDelta, formatINR, formatShortDate } from "@/lib/format";
import { ACCOUNT_TYPE_LABELS, type AccountType, type TimeRange } from "@/types";

const COLORS = ["#6c63ff", "#22c55e", "#f59e0b", "#06b6d4", "#ec4899", "#f97316"];

export default function Overview() {
  const [range, setRange] = useState<TimeRange>("1y");
  const summary = useSummary();
  const accounts = useAccounts();
  const history = useNetworthHistory(range);
  if (summary.isLoading || accounts.isLoading || history.isLoading) return <Page><LoadingSkeleton /></Page>;
  if (summary.isError || accounts.isError || history.isError) return <Page><EmptyState message="Could not load your portfolio. Check that the API is running." /></Page>;

  const data = summary.data!;
  const tracked = (accounts.data ?? []).filter((account) => account.consider_for_networth);
  const delta = formatDelta(data.current_net_worth, data.previous_net_worth);
  const metrics = [
    ["3M Monthly Growth", data.summary_metrics.monthly_growth_3m == null ? "—" : formatINR(data.summary_metrics.monthly_growth_3m, true)],
    ["Best Type", data.summary_metrics.best_performer_type ? ACCOUNT_TYPE_LABELS[data.summary_metrics.best_performer_type as AccountType] ?? data.summary_metrics.best_performer_type : "—"],
    ["Best Growth", data.summary_metrics.best_performer_pct == null ? "—" : `${data.summary_metrics.best_performer_pct.toFixed(1)}%`],
    ["Portfolio Age", data.summary_metrics.portfolio_age_days == null ? "—" : `${data.summary_metrics.portfolio_age_days} days`],
    ["Entries Logged", String(data.summary_metrics.entries_logged)],
    ["Avg Entry Gap", data.summary_metrics.avg_entry_gap_days == null ? "—" : `${data.summary_metrics.avg_entry_gap_days.toFixed(1)} days`],
  ];

  return <Page>
    <header className="pt-6 pb-4">
      <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">
        <span>Total Net Worth</span><span>{data.last_entry_date ? `Updated ${formatShortDate(data.last_entry_date)}` : "No entries yet"}</span>
      </div>
      <div className="mt-1 flex flex-wrap items-end gap-3">
        <h1 className="text-4xl font-mono font-semibold tracking-tight text-[#e4e6ea]">{formatINR(data.current_net_worth)}</h1>
        <span className={`mb-1 flex items-center gap-1 text-sm font-mono ${delta.neutral ? "text-[#9ca3af]" : delta.positive ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
          {!delta.neutral && (delta.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />)}{delta.text}
        </span>
      </div>
    </header>

    <div className="mb-3 flex items-center justify-between"><Label>Net Worth Trend</Label><TimeRangeSelector selected={range} onChange={setRange} /></div>
    <section className="wl-card mb-4 p-3">
      {(history.data?.length ?? 0) > 0 ? <ResponsiveContainer width="100%" height={190}>
        <LineChart data={history.data}><CartesianGrid strokeDasharray="3 3" stroke="#3a3d44" vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(value) => formatINR(value, true)} tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={58} />
          <Tooltip formatter={(value: number) => formatINR(value)} labelFormatter={(label) => formatDate(String(label))} contentStyle={{ background: "#1b1c1f", border: "1px solid #3a3d44", borderRadius: 8 }} />
          <Line type="monotone" dataKey="net_worth" name="Net Worth" stroke="#6c63ff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer> : <EmptyState message="Add accounts and save your first snapshot to see the trend." />}
    </section>

    <Label>Portfolio Mix</Label>
    <section className="wl-card mb-4 p-3">
      {data.breakdown_by_type.length ? <>
        <ResponsiveContainer width="100%" height={190}><PieChart><Pie data={data.breakdown_by_type} dataKey="total_value" nameKey="type" innerRadius={52} outerRadius={78} paddingAngle={2}>
          {data.breakdown_by_type.map((item, index) => <Cell key={item.type} fill={COLORS[index % COLORS.length]} />)}
        </Pie><Tooltip formatter={(value: number) => formatINR(value)} contentStyle={{ background: "#1b1c1f", border: "1px solid #3a3d44", borderRadius: 8 }} /></PieChart></ResponsiveContainer>
        <div className="space-y-2">{data.breakdown_by_type.map((item, index) => <div key={item.type} className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-[#e4e6ea]"><span className="h-2 w-2 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />{ACCOUNT_TYPE_LABELS[item.type as AccountType] ?? item.type}</span>
          <span className="font-mono text-[#9ca3af]">{formatINR(item.total_value, true)} · {item.percentage.toFixed(1)}%</span>
        </div>)}</div>
      </> : <p className="py-8 text-center text-sm font-mono text-[#9ca3af]">No breakdown yet</p>}
    </section>

    <Label>Portfolio Signals</Label>
    <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">{metrics.map(([name, value]) => <div key={name} className="wl-card min-w-[145px] shrink-0 p-3">
      <p className="text-[10px] font-mono text-[#9ca3af]">{name}</p><p className="mt-1 text-sm font-mono font-semibold text-[#e4e6ea]">{value}</p>
    </div>)}</div>

    <Label>Top Positions</Label>
    {tracked.length ? <section className="wl-card mb-4 overflow-hidden">{[...tracked].sort((a, b) => (b.current_value ?? 0) - (a.current_value ?? 0)).slice(0, 5).map((account, index, list) => <Link to={`/accounts/${account.id}`} key={account.id} className={`flex min-h-[58px] items-center justify-between px-3 ${index < list.length - 1 ? "border-b border-[#3a3d44]" : ""}`}>
      <span><span className="block text-sm text-[#e4e6ea]">{account.name}</span><span className="text-[10px] font-mono text-[#9ca3af]">{ACCOUNT_TYPE_LABELS[account.type]}</span></span>
      <span className="text-right"><span className="block text-sm font-mono text-[#e4e6ea]">{formatINR(account.current_value ?? 0, true)}</span><span className={`text-[10px] font-mono ${account.previous_value == null ? "text-[#9ca3af]" : (account.change_absolute ?? 0) >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>{formatDelta(account.current_value, account.previous_value).text}</span></span>
    </Link>)}</section> : <EmptyState message="No net worth accounts yet." />}

    {data.excluded_accounts.length > 0 && <><Label>Other Accounts</Label><section className="wl-card mb-4 overflow-hidden opacity-70">{data.excluded_accounts.map((account) => <Link to={`/accounts/${account.id}`} key={account.id} className="flex min-h-[54px] items-center justify-between border-b border-[#3a3d44] px-3 last:border-0">
      <span className="text-sm text-[#e4e6ea]">{account.name}</span><span className="text-sm font-mono text-[#9ca3af]">{formatINR(account.current_value ?? 0, true)}</span>
    </Link>)}</section></>}
  </Page>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">{children}</p>;
}
function Page({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0e0e10] pb-20"><main className="mx-auto max-w-xl px-4">{children}</main><BottomNav /></div>;
}
