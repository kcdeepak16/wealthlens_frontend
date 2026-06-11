import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AccountFormSheet from "@/components/AccountFormSheet";
import BottomNav from "@/components/BottomNav";
import ConfirmSheet from "@/components/ConfirmSheet";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import MetricFormSheet from "@/components/MetricFormSheet";
import { useAccounts, useCreateAccount, useDeleteAccount, useUpdateAccount } from "@/hooks/useAccounts";
import { useCreateMetric, useDeleteMetric, useUpdateMetric } from "@/hooks/useMetrics";
import { useClearAllData } from "@/hooks/useSnapshot";
import { ACCOUNT_TYPE_LABELS, type AccountWithStats, type Metric } from "@/types";

type DeleteTarget = { kind: "account"; account: AccountWithStats } | { kind: "metric"; accountId: number; metric: Metric } | { kind: "all" } | null;

export default function AppSettings() {
  const query = useAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();
  const clearAll = useClearAllData();
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [accountForm, setAccountForm] = useState<{ open: boolean; account: AccountWithStats | null }>({ open: false, account: null });
  const [metricForm, setMetricForm] = useState<{ open: boolean; accountId: number; metric: Metric | null }>({ open: false, accountId: 0, metric: null });
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const createMetric = useCreateMetric(metricForm.accountId);
  const updateMetric = useUpdateMetric(metricForm.accountId);
  const deleteMetric = useDeleteMetric(deleteTarget?.kind === "metric" ? deleteTarget.accountId : 0);

  if (query.isLoading) return <Page><LoadingSkeleton /></Page>;
  if (query.isError) return <Page><EmptyState message="Could not load settings." /></Page>;
  const accounts = query.data ?? [];
  const closeAccount = () => setAccountForm({ open: false, account: null });
  const closeMetric = () => setMetricForm({ open: false, accountId: 0, metric: null });

  const confirmDelete = () => {
    if (deleteTarget?.kind === "account") deleteAccount.mutate(deleteTarget.account.id, { onSuccess: () => { setDeleteTarget(null); toast.success("Account deleted"); } });
    if (deleteTarget?.kind === "metric") deleteMetric.mutate(deleteTarget.metric.id, { onSuccess: () => { setDeleteTarget(null); toast.success("Metric deleted"); } });
    if (deleteTarget?.kind === "all") clearAll.mutate(undefined, { onSuccess: () => { setDeleteTarget(null); toast.success("All data cleared"); } });
  };

  return <Page>
    <header className="pt-6 pb-5"><p className="text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">WealthLens</p><h1 className="text-xl font-semibold text-[#e4e6ea]">Settings</h1></header>
    <section className="wl-card mb-6 flex items-center justify-between p-4"><div><p className="text-sm font-semibold text-[#e4e6ea]">WealthLens</p><p className="text-xs font-mono text-[#9ca3af]">v1.0.0 · Personal Net Worth</p></div><div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#6c63ff]/30 bg-[#6c63ff]/20 font-mono font-bold text-[#6c63ff]">W</div></section>

    <div className="mb-6"><div className="mb-3 flex items-center justify-between"><Label>Accounts ({accounts.length})</Label><button onClick={() => setAccountForm({ open: true, account: null })} className="flex min-h-[44px] items-center gap-1 px-2 text-xs font-medium text-[#6c63ff]"><Plus size={14} />Add</button></div>
      {!accounts.length ? <EmptyState message="No accounts yet." ctaLabel="Add Account" onCta={() => setAccountForm({ open: true, account: null })} /> : <section className="wl-card overflow-hidden">{accounts.map((account, index) => {
        const isExpanded = expanded.has(account.id);
        return <div key={account.id} className={index < accounts.length - 1 ? "border-b border-[#3a3d44]" : ""}>
          <div className="flex min-h-[64px] items-center gap-2 px-3">
            <button onClick={() => setAccountForm({ open: true, account })} className="min-w-0 flex-1 text-left"><p className="truncate text-sm font-medium text-[#e4e6ea]">{account.name}</p><p className="text-[10px] font-mono text-[#9ca3af]">{ACCOUNT_TYPE_LABELS[account.type]} · {account.metrics.length} metric{account.metrics.length === 1 ? "" : "s"}</p></button>
            <button aria-label="Toggle net worth" onClick={() => updateAccount.mutate({ id: account.id, data: { consider_for_networth: !account.consider_for_networth } })} className="flex h-11 w-11 items-center justify-center"><span className={`h-6 w-11 rounded-full p-1 ${account.consider_for_networth ? "bg-[#6c63ff]" : "bg-[#3a3d44]"}`}><span className={`block h-4 w-4 rounded-full bg-white transition-transform ${account.consider_for_networth ? "translate-x-5" : ""}`} /></span></button>
            <button aria-label="Expand metrics" onClick={() => setExpanded((current) => { const next = new Set(current); next.has(account.id) ? next.delete(account.id) : next.add(account.id); return next; })} className="flex h-11 w-11 items-center justify-center"><ChevronDown size={16} className={`text-[#9ca3af] transition-transform ${isExpanded ? "rotate-180" : ""}`} /></button>
            <button aria-label="Delete account" onClick={() => setDeleteTarget({ kind: "account", account })} className="flex h-11 w-11 items-center justify-center"><Trash2 size={14} className="text-[#ef4444]" /></button>
          </div>
          {isExpanded && <div className="border-t border-[#3a3d44] bg-[#16171a] px-3 py-2">
            {account.metrics.map((metric, metricIndex) => <div key={metric.id} className={`flex min-h-[52px] items-center gap-2 ${metricIndex < account.metrics.length - 1 ? "border-b border-[#3a3d44]/60" : ""}`}><div className="min-w-0 flex-1"><p className="truncate text-xs text-[#e4e6ea]">{metric.name}</p><p className="text-[10px] font-mono text-[#9ca3af]">{metric.is_percentage ? "Percentage" : "Absolute value"}</p></div>
              <button aria-label="Edit metric" onClick={() => setMetricForm({ open: true, accountId: account.id, metric })} className="flex h-11 w-11 items-center justify-center"><Pencil size={13} className="text-[#6c63ff]" /></button>
              <button aria-label="Delete metric" onClick={() => setDeleteTarget({ kind: "metric", accountId: account.id, metric })} className="flex h-11 w-11 items-center justify-center"><Trash2 size={13} className="text-[#ef4444]" /></button>
            </div>)}
            {!account.metrics.length && <p className="py-2 text-[10px] font-mono text-[#9ca3af]">No metrics yet</p>}
            <button onClick={() => setMetricForm({ open: true, accountId: account.id, metric: null })} className="flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-[#6c63ff]"><Plus size={12} />Add Metric to {account.name}</button>
          </div>}
        </div>;
      })}</section>}
    </div>

    <div className="mb-6"><Label>Preferences</Label><section className="wl-card overflow-hidden">
      {[["Snapshot Reminder", "Every 2 weeks", "Tue, 9 AM"], ["Currency", "Display format", "INR (₹)"], ["Date Format", "Entry display", "DD MMM YYYY"]].map((item, index) => <div key={item[0]} className={`flex min-h-[64px] items-center justify-between px-3 ${index < 2 ? "border-b border-[#3a3d44]" : ""}`}><div><p className="text-sm text-[#e4e6ea]">{item[0]}</p><p className="text-[10px] font-mono text-[#9ca3af]">{item[1]}</p></div><div className="flex items-center gap-2"><span className="text-xs font-mono text-[#9ca3af]">{item[2]}</span><ChevronRight size={14} className="text-[#3a3d44]" /></div></div>)}
    </section></div>

    <div className="mb-6"><Label>Danger Zone</Label><section className="wl-card"><button onClick={() => setDeleteTarget({ kind: "all" })} className="flex min-h-[64px] w-full items-center justify-between px-3 text-left"><div><p className="text-sm font-medium text-[#ef4444]">Clear All Data</p><p className="text-[10px] font-mono text-[#9ca3af]">Remove all accounts, entries, and metrics</p></div><ChevronRight size={14} className="text-[#3a3d44]" /></button></section></div>

    <AccountFormSheet open={accountForm.open} account={accountForm.account} onClose={closeAccount} pending={createAccount.isPending || updateAccount.isPending} onSave={(data) => {
      if (accountForm.account) updateAccount.mutate({ id: accountForm.account.id, data }, { onSuccess: () => { closeAccount(); toast.success("Account updated"); } });
      else createAccount.mutate(data, { onSuccess: () => { closeAccount(); toast.success("Account added"); } });
    }} />
    <MetricFormSheet open={metricForm.open} metric={metricForm.metric} onClose={closeMetric} pending={createMetric.isPending || updateMetric.isPending} onSave={(data) => {
      if (metricForm.metric) updateMetric.mutate({ metricId: metricForm.metric.id, data }, { onSuccess: () => { closeMetric(); toast.success("Metric updated"); } });
      else createMetric.mutate(data, { onSuccess: () => { closeMetric(); toast.success("Metric added"); } });
    }} />
    <ConfirmSheet isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)}
      title={deleteTarget?.kind === "all" ? "Clear all data?" : deleteTarget?.kind === "metric" ? "Delete this metric?" : "Delete this account?"}
      description={deleteTarget?.kind === "all" ? "This will permanently delete all accounts, entries, and metrics. This cannot be undone." : deleteTarget?.kind === "metric" ? "This will permanently delete the metric and all of its recorded values." : "This will permanently delete the account and all of its entries."}
      confirmLabel={deleteTarget?.kind === "all" ? "Clear All Data" : "Delete"} destructive onConfirm={confirmDelete} />
  </Page>;
}
function Label({ children }: { children: React.ReactNode }) { return <p className="text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">{children}</p>; }
function Page({ children }: { children: React.ReactNode }) { return <div className="min-h-screen bg-[#0e0e10] pb-20"><main className="mx-auto max-w-xl px-4">{children}</main><BottomNav /></div>; }
