import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMetric, deleteMetric, updateMetric } from "@/api/accounts";
import type { MetricCreate, MetricUpdate } from "@/types";

export function useCreateMetric(accountId: number) {
  const client = useQueryClient();
  return useMutation({ mutationFn: (data: MetricCreate) => createMetric(accountId, data), onSuccess: () => {
    client.invalidateQueries({ queryKey: ["accounts"] });
    client.invalidateQueries({ queryKey: ["accounts", accountId] });
  }});
}
export function useUpdateMetric(accountId: number) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ metricId, data }: { metricId: number; data: MetricUpdate }) => updateMetric(metricId, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["accounts"] });
      client.invalidateQueries({ queryKey: ["accounts", accountId] });
      client.invalidateQueries({ queryKey: ["account-chart", accountId] });
    },
  });
}
export function useDeleteMetric(accountId: number) {
  const client = useQueryClient();
  return useMutation({ mutationFn: deleteMetric, onSuccess: () => {
    client.invalidateQueries({ queryKey: ["accounts"] });
    client.invalidateQueries({ queryKey: ["accounts", accountId] });
    client.invalidateQueries({ queryKey: ["account-chart", accountId] });
  }});
}
