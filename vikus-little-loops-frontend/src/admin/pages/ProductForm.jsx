import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiUploadCloud, FiX, FiStar } from "react-icons/fi";
import {
  createProduct, updateProduct, getProduct,
  getCategories, getCollections, uploadImage,
  getColors, getSizes,
} from "@/admin/lib/adminApi";
import { PageTitle, Panel, Spinner } from "@/admin/components/AdminUI";

const inp =
  "w-full rounded-xl border border-white/10 bg-[#15101a] px-4 py-2.5 text-sm text-white outline-none transition focus:border-blush-500 placeholder:text-blush-200/30";
const lbl = "mb-1.5 block text-xs uppercase tracking-wide text-blush-200/50";

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function ProductForm() {
  const { slug } = useParams();
  const editing = Boolean(slug);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { is_published: true, discount_percent: 0, stock: 0, tags: "" },
  });

  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]); // [{ color_id, size_id, sku, price_override, quantity }]
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const qc = useQueryClient();

  const { data: categories } = useQuery({ queryKey: ["cats-all"], queryFn: getCategories });
  const { data: collections } = useQuery({ queryKey: ["cols-all"], queryFn: getCollections });
  const { data: colors } = useQuery({ queryKey: ["colors"], queryFn: getColors });
  const { data: sizes } = useQuery({ queryKey: ["sizes"], queryFn: getSizes });
  const { data: existing, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    enabled: editing,
  });

  useEffect(() => {
    if (existing) {
      setEditId(existing.id);
      reset({
        ...existing,
        // API returns Decimal as string — convert to number for the input.
        price: Number(existing.price),
        discount_percent: Number(existing.discount_percent) || 0,
        stock: Number(existing.stock) || 0,
        tags: (existing.tags || []).join(", "),
        category_id: existing.category_id ?? "",
        collection_id: existing.collection_id ?? "",
        is_published: existing.is_published ?? true,
        is_featured: existing.is_featured ?? false,
        is_trending: existing.is_trending ?? false,
        is_best_seller: existing.is_best_seller ?? false,
        is_new_arrival: existing.is_new_arrival ?? false,
      });
      setImages(existing.images || []);
      // Populate existing variants
      if (existing.variants?.length) {
        setVariants(
          existing.variants.map((v) => ({
            color_id: v.color_id ?? "",
            size_id: v.size_id ?? "",
            sku: v.sku || "",
            price_override: v.price_override ?? "",
            quantity: v.inventory?.quantity ?? 0,
          }))
        );
      }
    }
  }, [existing, reset]);

  // auto-slug from name (create only)
  const nameVal = watch("name");
  useEffect(() => {
    if (!editing && nameVal) setValue("slug", slugify(nameVal));
  }, [nameVal, editing, setValue]);

  const handleFiles = async (files) => {
    setUploading(true);
    setError("");
    try {
      for (const file of files) {
        const res = await uploadImage(file);
        setImages((prev) => [
          ...prev,
          { url: res.url, public_id: res.public_id, is_primary: prev.length === 0, sort_order: prev.length, alt_text: "" },
        ]);
      }
    } catch (e) {
      setError(e?.response?.data?.detail || "Image upload failed (check Cloudinary config).");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (form) => {
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      discount_percent: Number(form.discount_percent) || 0,
      stock: Number(form.stock) || 0,
      category_id: form.category_id ? Number(form.category_id) : null,
      collection_id: form.collection_id ? Number(form.collection_id) : null,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };
    // Normalize variants
    const cleanVariants = variants
      .filter((v) => v.color_id || v.size_id)
      .map((v) => ({
        color_id: v.color_id ? Number(v.color_id) : null,
        size_id: v.size_id ? Number(v.size_id) : null,
        sku: v.sku || null,
        price_override: v.price_override !== "" ? Number(v.price_override) : null,
        quantity: Number(v.quantity) || 0,
      }));
    // Normalize images to the API shape (strip server-only fields like id).
    const cleanImages = images.map((im, i) => ({
      url: im.url,
      public_id: im.public_id || null,
      alt_text: im.alt_text || null,
      is_primary: !!im.is_primary,
      sort_order: i,
    }));
    try {
      if (editing) {
        delete payload.variants;
        payload.images = cleanImages; // replaces the full image set
        await updateProduct(editId, payload);
        // Invalidate so the storefront and admin list both pick up the new data.
        qc.invalidateQueries({ queryKey: ["product", slug] });
        qc.invalidateQueries({ queryKey: ["products"] });
      } else {
        payload.images = cleanImages;
        payload.variants = cleanVariants;
        await createProduct(payload);
        qc.invalidateQueries({ queryKey: ["products"] });
      }
      navigate("/admin/products");
    } catch (e) {
      setError(e?.response?.data?.detail || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (editing && isLoading) return <Spinner />;

  return (
    <>
      <PageTitle title={editing ? "Edit Product" : "New Product"} subtitle="Crafted details for your boutique" />
      {error && <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* LEFT */}
        <div className="space-y-6">
          <Panel className="space-y-4">
            <div>
              <label className={lbl}>Product name</label>
              <input className={inp} {...register("name", { required: true })} />
              {errors.name && <p className="mt-1 text-xs text-red-400">Required</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={lbl}>Slug</label>
                <input className={inp} {...register("slug", { required: true })} />
              </div>
              <div>
                <label className={lbl}>SKU</label>
                <input className={inp} {...register("sku")} />
              </div>
            </div>
            <div>
              <label className={lbl}>Short description</label>
              <input className={inp} {...register("short_description")} />
            </div>
            <div>
              <label className={lbl}>Long description</label>
              <textarea rows={5} className={inp} {...register("long_description")} />
            </div>
          </Panel>

          {/* Images */}
          <Panel>
            <label className={lbl}>Images</label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles([...e.dataTransfer.files]); }}
              className="grid place-items-center rounded-xl border-2 border-dashed border-white/10 bg-[#15101a] py-8 text-center"
            >
              <FiUploadCloud className="text-blush-300" size={26} />
              <p className="mt-2 text-sm text-blush-200/60">Drag & drop, or</p>
              <label className="mt-2 cursor-pointer rounded-lg bg-blush-500/20 px-3 py-1.5 text-sm text-blush-200 hover:bg-blush-500/30">
                Browse files
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles([...e.target.files])}
                />
              </label>
              {uploading && <p className="mt-2 text-xs text-blush-300">Uploading to Cloudinary…</p>}
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.map((im, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-white/10">
                    <img src={im.url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <FiX size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setImages((p) => p.map((x, idx) => ({ ...x, is_primary: idx === i })))}
                      className={`absolute left-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full ${im.is_primary ? "bg-blush-500 text-white" : "bg-black/60 text-white/70 opacity-0 group-hover:opacity-100"}`}
                      title="Set primary"
                    >
                      <FiStar size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {/* SEO */}
          <Panel className="space-y-4">
            <h3 className="font-display text-white">SEO</h3>
            <div>
              <label className={lbl}>Meta title</label>
              <input className={inp} {...register("meta_title")} />
            </div>
            <div>
              <label className={lbl}>Meta description</label>
              <textarea rows={2} className={inp} {...register("meta_description")} />
            </div>
            <div>
              <label className={lbl}>Image alt text</label>
              <input className={inp} {...register("alt_text")} />
            </div>
          </Panel>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <Panel className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Price (₹)</label>
                <input type="number" step="0.01" className={inp} {...register("price", { required: true })} />
              </div>
              <div>
                <label className={lbl}>Discount %</label>
                <input type="number" className={inp} {...register("discount_percent")} />
              </div>
            </div>
            <div>
              <label className={lbl}>Stock</label>
              <input type="number" className={inp} {...register("stock")} />
            </div>
            <div>
              <label className={lbl}>Category</label>
              <select className={inp} {...register("category_id")}>
                <option value="">— none —</option>
                {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Collection</label>
              <select className={inp} {...register("collection_id")}>
                <option value="">— none —</option>
                {collections?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Tags (comma-separated)</label>
              <input className={inp} {...register("tags")} placeholder="handmade, crochet" />
            </div>
          </Panel>

          <Panel className="space-y-4">
            <h3 className="font-display text-white">Details</h3>
            <div><label className={lbl}>Material</label><input className={inp} {...register("material")} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Weight</label><input className={inp} {...register("weight")} /></div>
              <div><label className={lbl}>Dimensions</label><input className={inp} {...register("dimensions")} /></div>
            </div>
            <div><label className={lbl}>Care instructions</label><textarea rows={2} className={inp} {...register("care_instructions")} /></div>
          </Panel>

          {/* Color Variants */}
          <Panel className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-white">Color Variants</h3>
              <button
                type="button"
                onClick={() => setVariants((v) => [...v, { color_id: "", size_id: "", sku: "", price_override: "", quantity: 0 }])}
                className="rounded-lg bg-blush-500/20 px-3 py-1 text-xs text-blush-200 hover:bg-blush-500/30"
              >
                + Add
              </button>
            </div>

            {/* Color swatches quick-pick */}
            {colors?.length > 0 && (
              <div>
                <p className={lbl}>Quick-add color</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colors.map((c) => {
                    const already = variants.some((v) => String(v.color_id) === String(c.id));
                    return (
                      <button
                        key={c.id}
                        type="button"
                        title={c.name}
                        disabled={already}
                        onClick={() =>
                          setVariants((v) => [...v, { color_id: c.id, size_id: "", sku: "", price_override: "", quantity: 0 }])
                        }
                        className={`relative h-8 w-8 rounded-full border-2 transition ${
                          already ? "opacity-40 cursor-not-allowed" : "hover:scale-110"
                        }`}
                        style={{
                          background: c.hex_code || "#d4a4b5",
                          borderColor: already ? "#d4a4b5" : "transparent",
                          boxShadow: "0 0 0 2px #ffffff22",
                        }}
                      >
                        {already && (
                          <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {variants.length === 0 && (
              <p className="text-xs text-blush-200/40">No variants yet — use quick-add or click + Add above.</p>
            )}

            <div className="space-y-3">
              {variants.map((v, i) => {
                const colorObj = colors?.find((c) => String(c.id) === String(v.color_id));
                return (
                  <div key={i} className="rounded-xl border border-white/10 bg-[#1a1025] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {colorObj?.hex_code && (
                          <span
                            className="inline-block h-5 w-5 rounded-full border border-white/20"
                            style={{ background: colorObj.hex_code }}
                          />
                        )}
                        <span className="text-sm text-blush-100">{colorObj?.name || `Variant ${i + 1}`}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVariants((vs) => vs.filter((_, idx) => idx !== i))}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={lbl}>Color</label>
                        <select
                          className={inp}
                          value={v.color_id}
                          onChange={(e) => setVariants((vs) => vs.map((x, idx) => idx === i ? { ...x, color_id: e.target.value } : x))}
                        >
                          <option value="">— none —</option>
                          {colors?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={lbl}>Size</label>
                        <select
                          className={inp}
                          value={v.size_id}
                          onChange={(e) => setVariants((vs) => vs.map((x, idx) => idx === i ? { ...x, size_id: e.target.value } : x))}
                        >
                          <option value="">— none —</option>
                          {sizes?.map((s) => <option key={s.id} value={s.id}>{s.label || s.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={lbl}>Price override (₹)</label>
                        <input
                          type="number" step="0.01" className={inp} placeholder="—"
                          value={v.price_override}
                          onChange={(e) => setVariants((vs) => vs.map((x, idx) => idx === i ? { ...x, price_override: e.target.value } : x))}
                        />
                      </div>
                      <div>
                        <label className={lbl}>Stock qty</label>
                        <input
                          type="number" className={inp} placeholder="0"
                          value={v.quantity}
                          onChange={(e) => setVariants((vs) => vs.map((x, idx) => idx === i ? { ...x, quantity: e.target.value } : x))}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel className="space-y-3">
            <h3 className="font-display text-white">Visibility</h3>
            {[
              ["is_featured", "Featured"],
              ["is_trending", "Trending"],
              ["is_best_seller", "Best Seller"],
              ["is_new_arrival", "New Arrival"],
              ["is_published", "Published"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 text-sm text-blush-100">
                <input type="checkbox" {...register(key)} className="h-4 w-4 accent-blush-500" />
                {label}
              </label>
            ))}
          </Panel>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-br from-blush-400 to-blush-600 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:shadow-lift disabled:opacity-60"
          >
            {saving ? "Saving…" : editing ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </form>
    </>
  );
}
