export default function EmptyState({ message, ctaLabel, onCta }: { message: string; ctaLabel?: string; onCta?: () => void }) {
  return <div className="wl-card px-5 py-10 text-center">
    <p className="text-sm font-mono text-[#9ca3af]">{message}</p>
    {ctaLabel && <button onClick={onCta} className="mt-4 min-h-[44px] rounded-lg bg-[#6c63ff] px-4 text-sm font-medium text-white">{ctaLabel}</button>}
  </div>;
}
