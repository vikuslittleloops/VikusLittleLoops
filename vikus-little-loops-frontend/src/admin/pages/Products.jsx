import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { getAdminProducts, deleteProduct } from "@/admin/lib/adminApi";
import { PageTitle, Panel, Spinner, EmptyState, Th, Td } from "@/admin/components/AdminUI";

export default function Products() {
  const qc = useQueryClient();
  const { data: products, isLoading } = useQuery({ queryKey: ["admin-products"], queryFn: getAdminProducts });
  const del = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const flag = (p) => {
    const tags = [];
    if (p.is_featured) tags.push("Featured");
    if (p.is_trending) tags.push("Trending");
    if (p.is_best_seller) tags.push("Bestseller");
    if (p.is_new_arrival) tags.push("New");
    return tags;
  };

  return (
    <>
      <PageTitle
        title="Products"
        subtitle="Create, edit, and manage your handmade pieces"
        action={
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-blush-400 to-blush-600 px-4 py-2.5 text-sm font-medium text-white transition hover:shadow-lift"
          >
            <FiPlus /> New Product
          </Link>
        }
      />

      {isLoading ? (
        <Spinner />
      ) : !products?.length ? (
        <EmptyState text="No products yet. Create your first piece." />
      ) : (
        <Panel className="overflow-x-auto p-0">
          <table className="w-full">
            <thead className="border-b border-white/5">
              <tr>
                <Th>Product</Th>
                <Th>Price</Th>
                <Th>Stock</Th>
                <Th>Tags</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/5">
                  <Td>
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-blush-500/10">
                        {p.images?.[0]?.url ? (
                          <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          "🧶"
                        )}
                      </span>
                      <div>
                        <p className="font-medium text-white">{p.name}</p>
                        <p className="text-xs text-blush-200/40">{p.slug}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    ₹{Number(p.price).toLocaleString("en-IN")}
                    {p.discount_percent > 0 && (
                      <span className="ml-2 text-xs text-emerald-300">-{p.discount_percent}%</span>
                    )}
                  </Td>
                  <Td>
                    <span className={p.stock <= 3 ? "text-red-300" : "text-blush-50"}>{p.stock}</span>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {flag(p).map((t) => (
                        <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[0.62rem] uppercase tracking-wide text-blush-200/60">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/products/${p.slug}/edit`}
                        className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-blush-200 hover:bg-white/10"
                      >
                        <FiEdit2 size={15} />
                      </Link>
                      <button
                        onClick={() => { if (confirm(`Delete "${p.name}"?`)) del.mutate(p.id); }}
                        className="grid h-9 w-9 place-items-center rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
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
