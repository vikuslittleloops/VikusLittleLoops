export function PageTitle({ title, subtitle, action }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-blush-200/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/5 bg-[#1c1522] p-5 ${className}`}>
      {children}
    </div>
  );
}

export function Spinner({ label = "Loading…" }) {
  return (
    <div className="grid place-items-center py-24">
      <div className="flex flex-col items-center gap-4 text-blush-200/60">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-blush-400/30 border-t-blush-400" />
        <span className="font-serif text-lg">{label}</span>
      </div>
    </div>
  );
}

export function EmptyState({ emoji = "🧶", text = "Nothing here yet." }) {
  return (
    <div className="grid place-items-center py-20 text-center">
      <p className="text-5xl">{emoji}</p>
      <p className="mt-3 font-serif text-xl text-blush-200/50">{text}</p>
    </div>
  );
}

const statusColors = {
  pending: "bg-amber-500/15 text-amber-300",
  confirmed: "bg-sky-500/15 text-sky-300",
  crafting: "bg-violet-500/15 text-violet-300",
  shipped: "bg-blue-500/15 text-blue-300",
  delivered: "bg-emerald-500/15 text-emerald-300",
  cancelled: "bg-red-500/15 text-red-300",
  new: "bg-blush-500/15 text-blush-300",
  reviewing: "bg-amber-500/15 text-amber-300",
  quoted: "bg-sky-500/15 text-sky-300",
  accepted: "bg-emerald-500/15 text-emerald-300",
  declined: "bg-red-500/15 text-red-300",
  completed: "bg-emerald-500/15 text-emerald-300",
};

export function StatusPill({ status }) {
  const cls = statusColors[status] || "bg-white/10 text-blush-100";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}

export function Th({ children, className = "" }) {
  return (
    <th className={`px-4 py-3 text-left text-[0.68rem] font-medium uppercase tracking-wider text-blush-200/40 ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-sm text-blush-50 ${className}`}>{children}</td>;
}
