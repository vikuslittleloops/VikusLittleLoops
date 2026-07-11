import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/admin/lib/adminApi";
import { PageTitle, Panel, Spinner, EmptyState, Th, Td } from "@/admin/components/AdminUI";

export default function Customers() {
  const { data, isLoading } = useQuery({ queryKey: ["customers"], queryFn: getCustomers });
  return (
    <>
      <PageTitle title="Customers" subtitle="People who love your little loops" />
      {isLoading ? <Spinner /> : !data?.length ? <EmptyState emoji="🌸" text="No customers yet." /> : (
        <Panel className="overflow-x-auto p-0">
          <table className="w-full">
            <thead className="border-b border-white/5"><tr><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Joined</Th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {data.map((c) => (
                <tr key={c.id} className="hover:bg-white/5">
                  <Td className="font-medium text-white">{c.name}</Td>
                  <Td className="text-blush-200/60">{c.email}</Td>
                  <Td>{c.phone || "—"}</Td>
                  <Td className="text-blush-200/40">{new Date(c.created_at).toLocaleDateString()}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </>
  );
}
