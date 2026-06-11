import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAccount, deleteAccount, getAccount, getAccountChartData, getAccountEntries,
  getAccounts, updateAccount,
} from "@/api/accounts";
import type { AccountCreate, AccountUpdate, TimeRange } from "@/types";

export const useAccounts = () => useQuery({ queryKey: ["accounts"], queryFn: getAccounts });
export const useAccount = (id: number) => useQuery({
  queryKey: ["accounts", id], queryFn: () => getAccount(id), enabled: Number.isFinite(id),
});
export const useAccountEntries = (id: number) => useQuery({
  queryKey: ["account-entries", id], queryFn: () => getAccountEntries(id), enabled: Number.isFinite(id),
});
export const useAccountChartData = (id: number, range: TimeRange) => useQuery({
  queryKey: ["account-chart", id, range], queryFn: () => getAccountChartData(id, range), enabled: Number.isFinite(id),
});
export function useCreateAccount() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (data: AccountCreate) => createAccount(data), onSuccess: () => {
    client.invalidateQueries({ queryKey: ["accounts"] });
    client.invalidateQueries({ queryKey: ["summary"] });
  }});
}
export function useUpdateAccount() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AccountUpdate }) => updateAccount(id, data),
    onSuccess: (_, variables) => {
      client.invalidateQueries({ queryKey: ["accounts"] });
      client.invalidateQueries({ queryKey: ["accounts", variables.id] });
      client.invalidateQueries({ queryKey: ["summary"] });
      client.invalidateQueries({ queryKey: ["networth-history"] });
    },
  });
}
export function useDeleteAccount() {
  const client = useQueryClient();
  return useMutation({ mutationFn: deleteAccount, onSuccess: () => {
    client.invalidateQueries({ queryKey: ["accounts"] });
    client.invalidateQueries({ queryKey: ["summary"] });
    client.invalidateQueries({ queryKey: ["networth-history"] });
  }});
}
