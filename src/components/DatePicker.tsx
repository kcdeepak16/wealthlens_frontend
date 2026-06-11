import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate, toISODate } from "@/lib/format";

export default function DatePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Popover>
    <PopoverTrigger asChild><button type="button" className="flex min-h-[44px] w-full items-center justify-between rounded-lg border border-[#3a3d44] bg-[#0e0e10] px-3 text-left text-sm font-mono text-[#e4e6ea]">
      {formatDate(value)}<CalendarIcon size={16} className="text-[#9ca3af]" />
    </button></PopoverTrigger>
    <PopoverContent className="w-auto p-0 bg-[#1b1c1f] border-[#3a3d44]"><Calendar mode="single" selected={new Date(`${value}T00:00:00`)}
      onSelect={(date) => date && onChange(toISODate(date))} /></PopoverContent>
  </Popover>;
}
