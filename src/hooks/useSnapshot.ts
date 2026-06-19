import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIndividualEntry } from "@/api/accounts";
import { clearAllData, createSnapshot, deleteEntry, updateEntry } from "@/api/entries";
import type { IndividualEntryCreate, SnapshotCreate } from "@/types";

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  client.invalidateQueries({ queryKey: ["accounts"] });
  client.invalidateQueries({ queryKey: ["summary"] });
  client.invalidateQueries({ queryKey: ["networth-history"] });
}
export function useCreateSnapshot() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (data: SnapshotCreate) => createSnapshot(data), onSuccess: () => invalidateAll(client) });
}
export function useCreateIndividualEntry(accountId: number) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: IndividualEntryCreate) => createIndividualEntry(accountId, data),
    onSuccess: () => {
      invalidateAll(client);
      client.invalidateQueries({ queryKey: ["account-entries", accountId] });
      client.invalidateQueries({ queryKey: ["account-chart", accountId] });
    },
  });
}
export function useDeleteEntry(accountId: number) {
  const client = useQueryClient();
  return useMutation({ mutationFn: deleteEntry, onSuccess: () => {
    invalidateAll(client);
    client.invalidateQueries({ queryKey: ["account-entries", accountId] });
    client.invalidateQueries({ queryKey: ["account-chart", accountId] });
  }});
}
export function useClearAllData() {
  const client = useQueryClient();
  return useMutation({ mutationFn: clearAllData, onSuccess: () => client.invalidateQueries() });
}

export function useUpdateEntry(accountId: number) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ entryId, data }: { entryId: number; data: any }) => updateEntry(entryId, data),
    onSuccess: () => {
      invalidateAll(client);
      client.invalidateQueries({ queryKey: ["account-entries", accountId] });
      client.invalidateQueries({ queryKey: ["account-chart", accountId] });
    },
  });
}
