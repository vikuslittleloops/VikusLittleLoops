import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomOrders, setCustomOrderStatus } from "@/admin/lib/adminApi";
import { PageTitle, Panel, Spinner, EmptyState, StatusPill } from "@/admin/components/AdminUI";

const STATUSES = ["new", "reviewing", "quoted", "accepted", "declined", "completed"];

export default function CustomOrders() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["custom-orders"], queryFn: getCustomOrders });
  const setStatus = useMutation({
    mutationFn: ({ id, status }) => setCustomOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["custom-orders"] }),
  });

  return (
    <>
      <PageTitle title="Custom Orders" subtitle="Bespoke requests from your customers" />
      {isLoading ? <Spinner /> : !data?.length ? <EmptyState emoji="💝" text="No custom requests yet." /> : (
        <div className="grid gap-4">
          {data.map((o) => (
            <Panel key={o.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg text-white">{o.name}</h3>
                    <StatusPill status={o.status} />
                  </div>
                  <p className="text-sm text-blush-200/50">{o.email}{o.phone ? ` · ${o.phone}` : ""}</p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => setStatus.mutate({ id: o.id, status: e.target.value })}
                  className="rounded-lg border border-white/10 bg-[#15101a] px-3 py-2 text-sm text-white outline-none focus:border-blush-500"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <p className="mt-3 text-sm text-blush-100/80">{o.details}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-blush-200/50">
                {o.color && <span className="rounded-full bg-white/5 px-2.5 py-1">Colour: {o.color}</span>}
                {o.size && <span className="rounded-full bg-white/5 px-2.5 py-1">Size: {o.size}</span>}
                {o.yarn && <span className="rounded-full bg-white/5 px-2.5 py-1">Yarn: {o.yarn}</span>}
                {o.budget && <span className="rounded-full bg-white/5 px-2.5 py-1">Budget: ₹{o.budget}</span>}
                {o.delivery_date && <span className="rounded-full bg-white/5 px-2.5 py-1">By: {o.delivery_date}</span>}
              </div>
              {o.inspiration_image_url && (
                <a href={o.inspiration_image_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-blush-300 underline">View inspiration image</a>
              )}
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
