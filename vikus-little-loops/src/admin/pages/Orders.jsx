import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, setOrderStatus } from "@/admin/lib/adminApi";
import { PageTitle, Panel, Spinner, EmptyState, StatusPill, Th, Td } from "@/admin/components/AdminUI";

const STATUSES = ["pending", "confirmed", "crafting", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["orders"], queryFn: getOrders });
  const setStatus = useMutation({
    mutationFn: ({ id, status }) => setOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });

  return (
    <>
      <PageTitle title="Orders" subtitle="Track and fulfil your orders" />
      {isLoading ? <Spinner /> : !data?.length ? <EmptyState emoji="🛍️" text="No orders yet." /> : (
        <Panel className="overflow-x-auto p-0">
          <table className="w-full">
            <thead className="border-b border-white/5">
              <tr><Th>Order</Th><Th>Customer</Th><Th>Total</Th><Th>Payment</Th><Th>Status</Th><Th>Update</Th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((o) => (
                <tr key={o.id} className="hover:bg-white/5">
                  <Td className="font-medium text-white">{o.order_number}</Td>
                  <Td>{o.ship_name || "—"}<span className="block text-xs text-blush-200/40">{o.ship_city}</span></Td>
                  <Td>₹{Number(o.total).toLocaleString("en-IN")}</Td>
                  <Td><StatusPill status={o.payment_status} /></Td>
                  <Td><StatusPill status={o.status} /></Td>
                  <Td>
                    <select
                      value={o.status}
                      onChange={(e) => setStatus.mutate({ id: o.id, status: e.target.value })}
                      className="rounded-lg border border-white/10 bg-[#15101a] px-2.5 py-1.5 text-xs text-white outline-none focus:border-blush-500"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </>
  );
}
