import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { getCategories, createCategory, deleteCategory } from "@/admin/lib/adminApi";
import { PageTitle, Panel, Spinner, EmptyState, Th, Td } from "@/admin/components/AdminUI";

const inp = "w-full rounded-xl border border-white/10 bg-[#15101a] px-4 py-2.5 text-sm text-white outline-none focus:border-blush-500";
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function Categories() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["cats-admin"], queryFn: getCategories });
  const [form, setForm] = useState({ name: "", emoji: "", slug: "" });

  const create = useMutation({
    mutationFn: createCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cats-admin"] }); setForm({ name: "", emoji: "", slug: "" }); },
  });
  const del = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cats-admin"] }),
  });

  const submit = (e) => {
    e.preventDefault();
    create.mutate({ name: form.name, emoji: form.emoji, slug: form.slug || slugify(form.name), is_active: true });
  };

  return (
    <>
      <PageTitle title="Categories" subtitle="New categories auto-appear across the storefront" />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <Panel>
          <h3 className="mb-4 font-display text-white">Add Category</h3>
          <form onSubmit={submit} className="space-y-3">
            <input className={inp} placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} required />
            <input className={inp} placeholder="Emoji (e.g. 🌷)" value={form.emoji}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
            <input className={inp} placeholder="slug" value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blush-400 to-blush-600 py-2.5 text-sm font-medium text-white hover:shadow-lift">
              <FiPlus /> Add
            </button>
            {create.isError && <p className="text-xs text-red-400">Could not create (slug may exist).</p>}
          </form>
        </Panel>

        <Panel className="overflow-x-auto p-0">
          {isLoading ? <Spinner /> : !data?.length ? <EmptyState text="No categories yet." /> : (
            <table className="w-full">
              <thead className="border-b border-white/5"><tr><Th>Category</Th><Th>Slug</Th><Th>Active</Th><Th className="text-right">—</Th></tr></thead>
              <tbody className="divide-y divide-white/5">
                {data.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5">
                    <Td><span className="mr-2">{c.emoji}</span>{c.name}</Td>
                    <Td className="text-blush-200/50">{c.slug}</Td>
                    <Td>{c.is_active ? "✓" : "—"}</Td>
                    <Td className="text-right">
                      <button onClick={() => { if (confirm(`Delete ${c.name}?`)) del.mutate(c.id); }}
                        className="grid h-9 w-9 place-items-center rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20">
                        <FiTrash2 size={15} />
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </div>
    </>
  );
}
