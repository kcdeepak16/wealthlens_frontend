export type AccountType = "bank_account" | "mutual_fund" | "stocks" | "pf" | "lent" | "other";
export type TimeRange = "3m" | "6m" | "1y" | "3y" | "5y" | "all";

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  bank_account: "Bank Account",
  mutual_fund: "Mutual Fund",
  stocks: "Stocks",
  pf: "PF",
  lent: "Lent",
  other: "Other",
};

export interface Metric {
  id: number;
  account_id: number;
  name: string;
  is_percentage: boolean;
}
export interface MetricCreate { name: string; is_percentage: boolean; }
export interface MetricUpdate { name?: string; is_percentage?: boolean; }
export interface Account {
  id: number;
  name: string;
  type: AccountType;
  date_of_start: string;
  consider_for_networth: boolean;
  metrics: Metric[];
}
export interface AccountCreate {
  name: string;
  type: AccountType;
  date_of_start: string;
  consider_for_networth: boolean;
}
export interface AccountUpdate {
  name?: string;
  type?: AccountType;
  date_of_start?: string;
  consider_for_networth?: boolean;
}
export interface AccountWithStats extends Account {
  current_value: number | null;
  previous_value: number | null;
  change_absolute: number | null;
  change_percent: number | null;
  sparkline: number[];
}
export interface MetricEntryIn { metric_id: number; value: number; }
export interface MetricEntryOut { id: number; metric_id: number; value: number; }
export interface AccountEntryOut {
  id: number;
  account_id: number;
  date_of_entry: string;
  current_value: number;
  metric_entries: MetricEntryOut[];
}
export interface SnapshotAccountPayload {
  account_id: number;
  current_value: number;
  metric_entries: MetricEntryIn[];
}
export interface SnapshotCreate { date_of_entry: string; accounts: SnapshotAccountPayload[]; }
export interface IndividualEntryCreate {
  date_of_entry: string;
  current_value: number;
  metric_entries: MetricEntryIn[];
}
export interface ChartDataPoint { date: string; value: number | null; }
export interface MetricChartSeries {
  metric_id: number;
  metric_name: string;
  is_percentage: boolean;
  data: ChartDataPoint[];
}
export interface AccountChartData {
  value_series: ChartDataPoint[];
  metric_series: MetricChartSeries[];
}
export interface NetWorthPoint { date: string; net_worth: number; }
export interface PortfolioBreakdownItem { type: string; total_value: number; percentage: number; }
export interface SummaryMetrics {
  monthly_growth_3m: number | null;
  best_performer_type: string | null;
  best_performer_pct: number | null;
  portfolio_age_days: number | null;
  entries_logged: number;
  avg_entry_gap_days: number | null;
}
export interface SummaryResponse {
  current_net_worth: number;
  previous_net_worth: number | null;
  change_absolute: number | null;
  change_percent: number | null;
  last_entry_date: string | null;
  breakdown_by_type: PortfolioBreakdownItem[];
  summary_metrics: SummaryMetrics;
  excluded_accounts: AccountWithStats[];
}
