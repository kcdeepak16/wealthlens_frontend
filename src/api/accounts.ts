import { apiClient } from "./client";
import type {
  Account,
  AccountChartData,
  AccountCreate,
  AccountEntryOut,
  AccountUpdate,
  AccountWithStats,
  IndividualEntryCreate,
  Metric,
  MetricCreate,
  MetricUpdate,
  TimeRange,
} from "@/types";

export async function getAccounts(): Promise<AccountWithStats[]> {
  return (await apiClient.get<AccountWithStats[]>("/accounts")).data;
}
export async function getAccount(id: number): Promise<AccountWithStats> {
  return (await apiClient.get<AccountWithStats>(`/accounts/${id}`)).data;
}
export async function createAccount(data: AccountCreate): Promise<Account> {
  return (await apiClient.post<Account>("/accounts", data)).data;
}
export async function updateAccount(id: number, data: AccountUpdate): Promise<Account> {
  return (await apiClient.put<Account>(`/accounts/${id}`, data)).data;
}
export async function deleteAccount(id: number): Promise<void> {
  await apiClient.delete(`/accounts/${id}`);
}
export async function getAccountEntries(id: number): Promise<AccountEntryOut[]> {
  return (await apiClient.get<AccountEntryOut[]>(`/accounts/${id}/entries`)).data;
}
export async function getAccountChartData(id: number, range: TimeRange): Promise<AccountChartData> {
  return (await apiClient.get<AccountChartData>(`/accounts/${id}/chart-data`, { params: { range } })).data;
}
export async function createIndividualEntry(id: number, data: IndividualEntryCreate): Promise<AccountEntryOut> {
  return (await apiClient.post<AccountEntryOut>(`/accounts/${id}/entries`, data)).data;
}
export async function createMetric(accountId: number, data: MetricCreate): Promise<Metric> {
  return (await apiClient.post<Metric>(`/accounts/${accountId}/metrics`, data)).data;
}
export async function updateMetric(metricId: number, data: MetricUpdate): Promise<Metric> {
  return (await apiClient.put<Metric>(`/metrics/${metricId}`, data)).data;
}
export async function deleteMetric(metricId: number): Promise<void> {
  await apiClient.delete(`/metrics/${metricId}`);
}
