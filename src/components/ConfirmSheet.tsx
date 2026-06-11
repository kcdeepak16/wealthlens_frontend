import {
  Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer";

export default function ConfirmSheet({ isOpen, onClose, onConfirm, title, description, confirmLabel = "Confirm", destructive = false }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string;
  confirmLabel?: string; destructive?: boolean;
}) {
  return <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DrawerContent className="max-w-xl mx-auto bg-[#1b1c1f] border-[#3a3d44]">
      <DrawerHeader className="text-left">
        <DrawerTitle className="text-[#e4e6ea]">{title}</DrawerTitle>
        <DrawerDescription className="text-[#9ca3af]">{description}</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <button onClick={onConfirm} className={`min-h-[48px] rounded-xl font-semibold text-white ${destructive ? "bg-[#ef4444]" : "bg-[#6c63ff]"}`}>{confirmLabel}</button>
        <button onClick={onClose} className="min-h-[48px] rounded-xl border border-[#3a3d44] text-[#e4e6ea]">Cancel</button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>;
}
