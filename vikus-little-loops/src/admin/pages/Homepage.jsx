import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSave, FiUploadCloud, FiX } from "react-icons/fi";
import { getHomepageSections, updateHomepageSection, uploadImage } from "@/admin/lib/adminApi";
import { PageTitle, Panel, Spinner } from "@/admin/components/AdminUI";

const inp = "w-full rounded-xl border border-white/10 bg-[#15101a] px-4 py-2.5 text-sm text-white outline-none focus:border-blush-500";
const lbl = "mb-1.5 block text-xs uppercase tracking-wide text-blush-200/50";

export default function Homepage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-homepage"], queryFn: getHomepageSections });

  const byKey = (k) => data?.find((s) => s.key === k);

  // Local state for the three editable blocks.
  const [hero, setHero] = useState({ title: "", subtitle: "", eyebrow: "", title_accent: "", cta_primary: "", cta_secondary: "" });
  const [marquee, setMarquee] = useState("");
  const [insta, setInsta] = useState({ handle: "", url: "" });
  const [creatorPhotos, setCreatorPhotos] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    if (!data) return;
    const h = byKey("hero");
    if (h) setHero({
      title: h.title || "", subtitle: h.subtitle || "",
      eyebrow: h.content?.eyebrow || "", title_accent: h.content?.title_accent || "",
      cta_primary: h.content?.cta_primary || "", cta_secondary: h.content?.cta_secondary || "",
    });
    const m = byKey("marquee");
    if (m?.content?.items) setMarquee(m.content.items.join("\n"));
    const ig = byKey("instagram");
    if (ig) setInsta({ handle: ig.content?.handle || "", url: ig.content?.url || "" });
    const cr = byKey("about_creator");
    if (cr?.content?.photos) setCreatorPhotos(cr.content.photos);
    const g = byKey("about_gallery");
    if (g?.content?.photos) setGalleryPhotos(g.content.photos);
  }, [data]);

  const uploadInto = async (files, setter, setBusy) => {
    setBusy(true);
    try {
      for (const file of files) {
        const res = await uploadImage(file);
        setter((prev) => [...prev, res.url]);
      }
    } catch {
      /* surfaced by save state below */
    } finally {
      setBusy(false);
    }
  };

  const handleCreatorUpload = (files) => uploadInto(files, setCreatorPhotos, setUploading);
  const handleGalleryUpload = (files) => uploadInto(files, setGalleryPhotos, setUploadingGallery);

  const save = useMutation({
    mutationFn: ({ key, payload }) => updateHomepageSection(key, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-homepage"] }),
  });

  if (isLoading) return <Spinner />;

  return (
    <>
      <PageTitle title="Homepage" subtitle="Edit hero, announcement bar, and Instagram — updates the live storefront" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hero */}
        <Panel>
          <h3 className="mb-4 font-display text-lg text-white">Hero</h3>
          <div className="space-y-3">
            <div><label className={lbl}>Eyebrow</label><input className={inp} value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} /></div>
            <div><label className={lbl}>Title (line 1)</label><input className={inp} value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} /></div>
            <div><label className={lbl}>Title accent (italic, line 2)</label><input className={inp} value={hero.title_accent} onChange={(e) => setHero({ ...hero, title_accent: e.target.value })} /></div>
            <div><label className={lbl}>Subtitle</label><textarea rows={2} className={inp} value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Primary button</label><input className={inp} value={hero.cta_primary} onChange={(e) => setHero({ ...hero, cta_primary: e.target.value })} /></div>
              <div><label className={lbl}>Secondary button</label><input className={inp} value={hero.cta_secondary} onChange={(e) => setHero({ ...hero, cta_secondary: e.target.value })} /></div>
            </div>
            <SaveBtn
              onClick={() => save.mutate({ key: "hero", payload: {
                title: hero.title, subtitle: hero.subtitle,
                content: { eyebrow: hero.eyebrow, title_accent: hero.title_accent, cta_primary: hero.cta_primary, cta_secondary: hero.cta_secondary },
              } })}
              saving={save.isPending}
            />
          </div>
        </Panel>

        <div className="space-y-6">
          {/* Marquee */}
          <Panel>
            <h3 className="mb-4 font-display text-lg text-white">Announcement Bar</h3>
            <label className={lbl}>One line per message</label>
            <textarea rows={5} className={inp} value={marquee} onChange={(e) => setMarquee(e.target.value)} placeholder={"Handmade in small batches\nFree gift wrapping"} />
            <div className="mt-3">
              <SaveBtn
                onClick={() => save.mutate({ key: "marquee", payload: { content: { items: marquee.split("\n").map((s) => s.trim()).filter(Boolean) } } })}
                saving={save.isPending}
              />
            </div>
          </Panel>

          {/* Instagram */}
          <Panel>
            <h3 className="mb-4 font-display text-lg text-white">Instagram</h3>
            <div className="space-y-3">
              <div><label className={lbl}>Handle</label><input className={inp} value={insta.handle} onChange={(e) => setInsta({ ...insta, handle: e.target.value })} placeholder="@vikuslittleloops" /></div>
              <div><label className={lbl}>Profile URL</label><input className={inp} value={insta.url} onChange={(e) => setInsta({ ...insta, url: e.target.value })} placeholder="https://instagram.com/vikuslittleloops" /></div>
              <SaveBtn
                onClick={() => save.mutate({ key: "instagram", payload: { content: { handle: insta.handle, url: insta.url } } })}
                saving={save.isPending}
              />
            </div>
          </Panel>
        </div>
      </div>

      {/* Creator photos (About page) */}
      <Panel className="mt-6">
        <h3 className="mb-1 font-display text-lg text-white">About — Creator Photos</h3>
        <p className="mb-4 text-sm text-blush-200/50">
          First photo is the main portrait; second appears as the small inset on the About page.
        </p>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleCreatorUpload([...e.dataTransfer.files]); }}
          className="grid place-items-center rounded-xl border-2 border-dashed border-white/10 bg-[#15101a] py-8 text-center"
        >
          <FiUploadCloud className="text-blush-300" size={26} />
          <p className="mt-2 text-sm text-blush-200/60">Drag & drop, or</p>
          <label className="mt-2 cursor-pointer rounded-lg bg-blush-500/20 px-3 py-1.5 text-sm text-blush-200 hover:bg-blush-500/30">
            Browse photos
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleCreatorUpload([...e.target.files])} />
          </label>
          {uploading && <p className="mt-2 text-xs text-blush-300">Uploading to Cloudinary…</p>}
        </div>

        {creatorPhotos.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {creatorPhotos.map((url, i) => (
              <div key={i} className="group relative h-28 w-24 overflow-hidden rounded-xl border border-white/10">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[0.6rem] text-white">
                  {i === 0 ? "Main" : i === 1 ? "Inset" : `#${i + 1}`}
                </span>
                <button
                  onClick={() => setCreatorPhotos((p) => p.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <SaveBtn
            onClick={() => save.mutate({ key: "about_creator", payload: { content: { photos: creatorPhotos } } })}
            saving={save.isPending}
          />
        </div>
      </Panel>

      {/* About gallery */}
      <Panel className="mt-6">
        <h3 className="mb-1 font-display text-lg text-white">About — Gallery</h3>
        <p className="mb-4 text-sm text-blush-200/50">
          Photos of your work, packaging & little moments — shown as a gallery on the About page.
        </p>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleGalleryUpload([...e.dataTransfer.files]); }}
          className="grid place-items-center rounded-xl border-2 border-dashed border-white/10 bg-[#15101a] py-8 text-center"
        >
          <FiUploadCloud className="text-blush-300" size={26} />
          <p className="mt-2 text-sm text-blush-200/60">Drag & drop, or</p>
          <label className="mt-2 cursor-pointer rounded-lg bg-blush-500/20 px-3 py-1.5 text-sm text-blush-200 hover:bg-blush-500/30">
            Browse photos
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleGalleryUpload([...e.target.files])} />
          </label>
          {uploadingGallery && <p className="mt-2 text-xs text-blush-300">Uploading to Cloudinary…</p>}
        </div>

        {galleryPhotos.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {galleryPhotos.map((url, i) => (
              <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-white/10">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => setGalleryPhotos((p) => p.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <SaveBtn
            onClick={() => save.mutate({ key: "about_gallery", payload: { content: { photos: galleryPhotos } } })}
            saving={save.isPending}
          />
        </div>
      </Panel>

      {save.isSuccess && <p className="mt-4 text-sm text-emerald-300">Saved! The storefront updates on next load.</p>}
    </>
  );
}

function SaveBtn({ onClick, saving }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-blush-400 to-blush-600 px-4 py-2.5 text-sm font-medium text-white transition hover:shadow-lift disabled:opacity-60"
    >
      <FiSave size={15} /> {saving ? "Saving…" : "Save"}
    </button>
  );
}
