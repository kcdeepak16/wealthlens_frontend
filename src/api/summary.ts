import { apiClient } from "./client";
import type { NetWorthPoint, SummaryResponse, TimeRange } from "@/types";

export async function getSummary(): Promise<SummaryResponse> {
  return (await apiClient.get<SummaryResponse>("/summary")).data;
}
export async function getNetworthHistory(range: TimeRange): Promise<NetWorthPoint[]> {
  return (await apiClient.get<NetWorthPoint[]>("/networth/history", { params: { range } })).data;
}
