import { apiClient } from "./client";
import type { AccountEntryOut, SnapshotCreate } from "@/types";

export async function createSnapshot(data: SnapshotCreate): Promise<AccountEntryOut[]> {
  return (await apiClient.post<AccountEntryOut[]>("/snapshots", data)).data;
}
export async function deleteEntry(id: number): Promise<void> {
  await apiClient.delete(`/entries/${id}`);
}
export async function clearAllData(): Promise<void> {
  await apiClient.delete("/data/all");
}
