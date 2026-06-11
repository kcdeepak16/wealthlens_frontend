import { useQuery } from "@tanstack/react-query";
import { getNetworthHistory, getSummary } from "@/api/summary";
import type { TimeRange } from "@/types";

export const useSummary = () => useQuery({ queryKey: ["summary"], queryFn: getSummary });
export const useNetworthHistory = (range: TimeRange) => useQuery({
  queryKey: ["networth-history", range], queryFn: () => getNetworthHistory(range),
});
