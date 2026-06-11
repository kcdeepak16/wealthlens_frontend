import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import AccountFormSheet from "@/components/AccountFormSheet";
import BottomNav from "@/components/BottomNav";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Sparkline from "@/components/Sparkline";
import { useAccounts, useCreateAccount } from "@/hooks/useAccounts";
import { formatDelta, formatINR } from "@/lib/format";
import { ACCOUNT_TYPE_LABELS, type AccountType, type AccountWithStats } from "@/types";

export default function Accounts() {
  const query = useAccounts();
  const create = useCreateAccount();
  const [open, setOpen] = useState(false);
  if (query.isLoading) return <Page><LoadingSkeleton /></Page>;
  if (query.isError) return <Page><EmptyState message="Could not load accounts." /></Page>;
  const accounts = query.data ?? [];
  const tracked = accounts.filter((account) => account.consider_for_networth);
  const excluded = accounts.filter((account) => !account.consider_for_networth);
  const total = tracked.reduce((sum, account) => sum + (account.current_value ?? 0), 0);
  const grouped = tracked.reduce<Partial<Record<AccountType, AccountWithStats[]>>>((result, account) => {
    (result[account.type] ??= []).push(account);
    return result;
  }, {});
  const groups = Object.entries(grouped) as [AccountType, AccountWithStats[]][];

  return <Page>
    <header className="flex items-center justify-between pt-6 pb-4">
      <div><p className="text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">Portfolio</p><h1 className="text-2xl font-mono font-semibold text-[#e4e6ea]">{formatINR(total, true)}</h1></div>
      <button onClick={() => setOpen(true)} className="flex min-h-[44px] items-center gap-1.5 rounded-lg bg-[#6c63ff] px-3 text-xs font-medium text-white"><Plus size={14} />Account</button>
    </header>
    <div className="mb-4 grid grid-cols-3 gap-2">
      <Stat label="Tracked" value={formatINR(total, true)} accent />
      <Stat label="Other" value={formatINR(excluded.reduce((sum, account) => sum + (account.current_value ?? 0), 0), true)} />
      <Stat label="Count" value={String(accounts.length)} />
    </div>
    {!accounts.length && <EmptyState message="No accounts yet." ctaLabel="Add Account" onCta={() => setOpen(true)} />}
    {groups.map(([type, items]) => {
      const groupTotal = items.reduce((sum, account) => sum + (account.current_value ?? 0), 0);
      return <AccountGroup key={type} title={ACCOUNT_TYPE_LABELS[type]} subtitle={`${formatINR(groupTotal, true)} · ${total ? (groupTotal / total * 100).toFixed(1) : "0.0"}%`} accounts={items} />;
    })}
    {excluded.length > 0 && <AccountGroup title="Other Accounts" subtitle={formatINR(excluded.reduce((sum, account) => sum + (account.current_value ?? 0), 0), true)} accounts={excluded} muted />}
    <AccountFormSheet open={open} onClose={() => setOpen(false)} pending={create.isPending} onSave={(data) => create.mutate(data, {
      onSuccess: () => { setOpen(false); toast.success("Account added"); },
      onError: () => toast.error("Could not add account"),
    })} />
  </Page>;
}

function AccountGroup({ title, subtitle, accounts, muted = false }: { title: string; subtitle: string; accounts: AccountWithStats[]; muted?: boolean }) {
  return <section className={`mb-4 ${muted ? "opacity-75" : ""}`}>
    <div className="mb-1.5 flex items-center justify-between"><p className="text-[10px] font-mono uppercase tracking-widest text-[#9ca3af]">{title}</p><p className="text-xs font-mono text-[#22c55e]">{subtitle}</p></div>
    <div className="wl-card overflow-hidden">{accounts.map((account, index) => {
      const delta = formatDelta(account.current_value, account.previous_value);
      return <Link key={account.id} to={`/accounts/${account.id}`} className={`flex min-h-[68px] items-center gap-3 px-3 active:bg-[#21222a] ${index < accounts.length - 1 ? "border-b border-[#3a3d44]" : ""}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#21222a] text-[8px] font-mono uppercase text-[#9ca3af]">{account.type.slice(0, 3)}</div>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[#e4e6ea]">{account.name}</p><p className="text-[10px] font-mono text-[#9ca3af]">{account.metrics.length} metric{account.metrics.length === 1 ? "" : "s"}</p></div>
        <Sparkline data={account.sparkline} positive={(account.change_absolute ?? 0) >= 0} width={52} height={20} />
        <div className="min-w-[82px] text-right"><p className="text-sm font-mono text-[#e4e6ea]">{formatINR(account.current_value ?? 0, true)}</p><p className={`text-[10px] font-mono ${delta.neutral ? "text-[#9ca3af]" : delta.positive ? "text-[#22c55e]" : "text-[#ef4444]"}`}>{delta.text.split(" ")[0]}</p></div>
        <ChevronRight size={14} className="text-[#3a3d44]" />
      </Link>;
    })}</div>
  </section>;
}
function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="wl-card p-3"><p className="text-[10px] font-mono text-[#9ca3af]">{label}</p><p className={`mt-1 text-sm font-mono ${accent ? "text-[#22c55e]" : "text-[#e4e6ea]"}`}>{value}</p></div>;
}
function Page({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0e0e10] pb-20"><main className="mx-auto max-w-xl px-4">{children}</main><BottomNav /></div>;
}
