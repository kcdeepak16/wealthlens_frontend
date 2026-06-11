import { Skeleton } from "@/components/ui/skeleton";
export default function LoadingSkeleton() {
  return <div className="space-y-3 pt-6"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-24 w-full" /><Skeleton className="h-48 w-full" /><Skeleton className="h-28 w-full" /></div>;
}
