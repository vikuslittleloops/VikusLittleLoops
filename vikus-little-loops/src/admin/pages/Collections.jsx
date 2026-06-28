import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus } from "react-icons/fi";
import { getCollections, createCollection } from "@/admin/lib/adminApi";
import { PageTitle, Panel, Spinner, EmptyState } from "@/admin/components/AdminUI";

const inp = "w-full rounded-xl border border-white/10 bg-[#15101a] px-4 py-2.5 text-sm text-white outline-none focus:border-blush-500";
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function Collections() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["cols-admin"], queryFn: getCollections });
  const [form, setForm] = useState({ name: "", description: "", is_featured: false });

  const create = useMutation({
    mutationFn: createCollection,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cols-admin"] }); setForm({ name: "", description: "", is_featured: false }); },
  });

  const submit = (e) => {
    e.preventDefault();
    create.mutate({ name: form.name, slug: slugify(form.name), description: form.description, is_featured: form.is_featured });
  };

  return (
    <>
      <PageTitle title="Collections" subtitle="Curated groupings for the storefront" />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <Panel>
          <h3 className="mb-4 font-display text-white">Add Collection</h3>
          <form onSubmit={submit} className="space-y-3">
            <input className={inp} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <textarea className={inp} rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label className="flex items-center gap-3 text-sm text-blush-100">
              <input type="checkbox" className="h-4 w-4 accent-blush-500" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
              Featured
            </label>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blush-400 to-blush-600 py-2.5 text-sm font-medium text-white hover:shadow-lift">
              <FiPlus /> Add
            </button>
          </form>
        </Panel>
        <Panel>
          {isLoading ? <Spinner /> : !data?.length ? <EmptyState text="No collections yet." /> : (
            <div className="grid gap-3 sm:grid-cols-2">
              {data.map((c) => (
                <div key={c.id} className="rounded-xl border border-white/5 bg-[#15101a] p-4">
                  <p className="font-display text-lg text-white">{c.name}</p>
                  <p className="mt-1 text-sm text-blush-200/50">{c.description || "—"}</p>
                  {c.is_featured && <span className="mt-2 inline-block rounded-full bg-blush-500/15 px-2 py-0.5 text-[0.62rem] uppercase tracking-wide text-blush-300">Featured</span>}
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
