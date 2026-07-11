import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSave, FiUploadCloud, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import {
  getHomepageSections, updateHomepageSection, uploadImage,
  getFaqs, createFaq, updateFaq, deleteFaq,
} from "@/admin/lib/adminApi";
import { PageTitle, Panel, Spinner } from "@/admin/components/AdminUI";

const inp = "w-full rounded-xl border border-white/10 bg-[#15101a] px-4 py-2.5 text-sm text-white outline-none focus:border-blush-500";
const lbl = "mb-1.5 block text-xs uppercase tracking-wide text-blush-200/50";

const DEFAULT_WHY = [
  { title: "Handcrafted with Love", text: "Every single stitch is made with care and patience, ensuring you receive a premium, unique piece.", photos: [] },
  { title: "Brought to Life for You", text: "Gladly accepting custom orders to match your exact vision.", photos: [] },
  { title: "Smiles in Every Package", text: "Opening your order feels like receiving a warm hug.", photos: [] },
];

function UploadBox({ onFiles, busy, hint }) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); onFiles([...e.dataTransfer.files]); }}
      className="grid place-items-center rounded-xl border-2 border-dashed border-white/10 bg-[#15101a] py-6 text-center"
    >
      <FiUploadCloud className="text-blush-300" size={24} />
      {hint && <p className="mt-1 text-xs text-blush-200/50">{hint}</p>}
      <label className="mt-2 cursor-pointer rounded-lg bg-blush-500/20 px-3 py-1.5 text-sm text-blush-200 hover:bg-blush-500/30">
        Browse photos
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles([...e.target.files])} />
      </label>
      {busy && <p className="mt-2 text-xs text-blush-300">Uploading to Cloudinary…</p>}
    </div>
  );
}

function Thumbs({ photos, onRemove, size = "h-24 w-24" }) {
  if (!photos.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      {photos.map((url, i) => (
        <div key={i} className={`group relative ${size} overflow-hidden rounded-xl border border-white/10`}>
          <img src={url} alt="" className="h-full w-full object-cover" />
          <button
            onClick={() => onRemove(i)}
            className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
          >
            <FiX size={12} />
          </button>
        </div>
      ))}
    </div>
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

export default function SiteContent() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-homepage"], queryFn: getHomepageSections });
  const { data: faqs, isLoading: faqsLoading } = useQuery({ queryKey: ["admin-faqs"], queryFn: getFaqs });

  const byKey = (k) => data?.find((s) => s.key === k);

  const [logo, setLogo] = useState("");
  const [slideshow, setSlideshow] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [why, setWhy] = useState(DEFAULT_WHY);
  const [about, setAbout] = useState({
    creator_kicker: "", creator_heading: "", creator_body: "", creator_signature: "",
  });
  const [faqDrafts, setFaqDrafts] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [busy, setBusy] = useState({});

  useEffect(() => {
    if (!data) return;
    setLogo(byKey("branding")?.content?.logo_url || "");
    setSlideshow(byKey("hero_slideshow")?.content?.photos || []);
    setGallery(byKey("home_gallery")?.content?.photos || []);
    const w = byKey("why_choose_us")?.content?.items;
    if (w?.length) setWhy(DEFAULT_WHY.map((d, i) => ({ ...d, ...(w[i] || {}) })));
    const a = byKey("about_texts")?.content;
    if (a) setAbout({
      creator_kicker: a.creator_kicker || "",
      creator_heading: a.creator_heading || "", creator_body: a.creator_body || "",
      creator_signature: a.creator_signature || "",
    });
  }, [data]);

  useEffect(() => { if (faqs) setFaqDrafts(faqs.map((f) => ({ ...f }))); }, [faqs]);

  const upload = async (files, apply, key) => {
    setBusy((b) => ({ ...b, [key]: true }));
    try {
      for (const file of files) {
        const res = await uploadImage(file);
        apply(res.url);
      }
    } finally {
      setBusy((b) => ({ ...b, [key]: false }));
    }
  };

  const save = useMutation({
    mutationFn: ({ key, payload }) => updateHomepageSection(key, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-homepage"] }),
  });

  const refreshFaqs = () => qc.invalidateQueries({ queryKey: ["admin-faqs"] });
  const faqUpdate = useMutation({ mutationFn: ({ id, payload }) => updateFaq(id, payload), onSuccess: refreshFaqs });
  const faqCreate = useMutation({ mutationFn: createFaq, onSuccess: () => { setNewFaq({ question: "", answer: "" }); refreshFaqs(); } });
  const faqDelete = useMutation({ mutationFn: deleteFaq, onSuccess: refreshFaqs });

  if (isLoading) return <Spinner />;

  return (
    <>
      <PageTitle title="Site Content" subtitle="Logo, photo slideshow, Why Choose Us, About texts & FAQs — updates the live storefront" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Logo */}
        <Panel>
          <h3 className="mb-1 font-display text-lg text-white">Logo</h3>
          <p className="mb-4 text-sm text-blush-200/50">Shown in the navbar. A square/circular image works best.</p>
          <UploadBox
            busy={busy.logo}
            onFiles={(files) => upload(files.slice(0, 1), (url) => setLogo(url), "logo")}
          />
          {logo && (
            <div className="mt-3 flex items-center gap-3">
              <img src={logo} alt="logo" className="h-16 w-16 rounded-full border border-white/10 object-cover" />
              <button onClick={() => setLogo("")} className="text-xs text-red-300 hover:underline">Remove</button>
            </div>
          )}
          <div className="mt-4">
            <SaveBtn onClick={() => save.mutate({ key: "branding", payload: { content: { logo_url: logo } } })} saving={save.isPending} />
          </div>
        </Panel>

        {/* Hero slideshow */}
        <Panel>
          <h3 className="mb-1 font-display text-lg text-white">Top Slideshow</h3>
          <p className="mb-4 text-sm text-blush-200/50">3–4 photos shown at the top of the homepage, rotating every second.</p>
          <UploadBox busy={busy.slides} onFiles={(files) => upload(files, (url) => setSlideshow((p) => [...p, url]), "slides")} />
          <Thumbs photos={slideshow} onRemove={(i) => setSlideshow((p) => p.filter((_, idx) => idx !== i))} />
          <div className="mt-4">
            <SaveBtn onClick={() => save.mutate({ key: "hero_slideshow", payload: { content: { photos: slideshow } } })} saving={save.isPending} />
          </div>
        </Panel>
      </div>

      {/* Home gallery */}
      <Panel className="mt-6">
        <h3 className="mb-1 font-display text-lg text-white">Homepage Gallery Strip</h3>
        <p className="mb-4 text-sm text-blush-200/50">A photo section below the hero — images rotate every second.</p>
        <UploadBox busy={busy.gallery} onFiles={(files) => upload(files, (url) => setGallery((p) => [...p, url]), "gallery")} />
        <Thumbs photos={gallery} onRemove={(i) => setGallery((p) => p.filter((_, idx) => idx !== i))} />
        <div className="mt-4">
          <SaveBtn onClick={() => save.mutate({ key: "home_gallery", payload: { content: { photos: gallery } } })} saving={save.isPending} />
        </div>
      </Panel>

      {/* Why choose us */}
      <Panel className="mt-6">
        <h3 className="mb-1 font-display text-lg text-white">Why Choose Us</h3>
        <p className="mb-4 text-sm text-blush-200/50">Three cards on the homepage. Add up to 2 photos per card (photos replace the emoji tile).</p>
        <div className="grid gap-5 lg:grid-cols-3">
          {why.map((item, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-[#15101a] p-4">
              <span className="text-xs text-blush-300">Card {i + 1}</span>
              <div className="mt-2 space-y-3">
                <div><label className={lbl}>Title</label><input className={inp} value={item.title} onChange={(e) => setWhy((p) => p.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} /></div>
                <div><label className={lbl}>Text</label><textarea rows={3} className={inp} value={item.text} onChange={(e) => setWhy((p) => p.map((x, idx) => idx === i ? { ...x, text: e.target.value } : x))} /></div>
                <UploadBox
                  busy={busy[`why${i}`]}
                  onFiles={(files) => upload(files, (url) => setWhy((p) => p.map((x, idx) => idx === i ? { ...x, photos: [...(x.photos || []), url].slice(0, 2) } : x)), `why${i}`)}
                />
                <Thumbs size="h-16 w-16" photos={item.photos || []} onRemove={(pi) => setWhy((p) => p.map((x, idx) => idx === i ? { ...x, photos: x.photos.filter((_, j) => j !== pi) } : x))} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <SaveBtn onClick={() => save.mutate({ key: "why_choose_us", payload: { content: { items: why } } })} saving={save.isPending} />
        </div>
      </Panel>

      {/* About page texts */}
      <Panel className="mt-6">
        <h3 className="mb-1 font-display text-lg text-white">About Page Texts</h3>
        <p className="mb-4 text-sm text-blush-200/50">Leave a field empty to keep the current website text.</p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div><label className={lbl}>Creator section kicker (currently "Meet the Creator")</label><input className={inp} value={about.creator_kicker} onChange={(e) => setAbout({ ...about, creator_kicker: e.target.value })} placeholder="Meet the Creator" /></div>
          <div><label className={lbl}>Creator heading</label><input className={inp} value={about.creator_heading} onChange={(e) => setAbout({ ...about, creator_heading: e.target.value })} placeholder="Hello, lovely soul ✨" /></div>
          <div><label className={lbl}>Signature</label><input className={inp} value={about.creator_signature} onChange={(e) => setAbout({ ...about, creator_signature: e.target.value })} placeholder="With love and gratitude, Varnika Agarwal 💗" /></div>
          <div className="lg:col-span-2"><label className={lbl}>Creator story (blank line = new paragraph)</label><textarea rows={6} className={inp} value={about.creator_body} onChange={(e) => setAbout({ ...about, creator_body: e.target.value })} placeholder="Welcome to my cozy little corner of the internet…" /></div>
        </div>
        <div className="mt-4">
          <SaveBtn onClick={() => save.mutate({ key: "about_texts", payload: { content: about } })} saving={save.isPending} />
        </div>
      </Panel>

      {/* FAQs */}
      <Panel className="mt-6">
        <h3 className="mb-1 font-display text-lg text-white">Little FAQs</h3>
        <p className="mb-4 text-sm text-blush-200/50">Shown on the Contact page. Edit an answer and press its save icon.</p>
        {faqsLoading ? <Spinner /> : (
          <div className="space-y-4">
            {faqDrafts.map((f, i) => (
              <div key={f.id} className="rounded-xl border border-white/10 bg-[#15101a] p-4">
                <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                  <input className={inp} value={f.question} onChange={(e) => setFaqDrafts((p) => p.map((x, idx) => idx === i ? { ...x, question: e.target.value } : x))} />
                  <textarea rows={2} className={inp} value={f.answer} onChange={(e) => setFaqDrafts((p) => p.map((x, idx) => idx === i ? { ...x, answer: e.target.value } : x))} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => faqUpdate.mutate({ id: f.id, payload: { question: f.question, answer: f.answer } })}
                      className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300 hover:opacity-80" title="Save"
                    ><FiSave size={15} /></button>
                    <button
                      onClick={() => { if (confirm("Delete this FAQ?")) faqDelete.mutate(f.id); }}
                      className="grid h-9 w-9 place-items-center rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20" title="Delete"
                    ><FiTrash2 size={15} /></button>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-dashed border-white/10 p-4">
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                <input className={inp} placeholder="New question" value={newFaq.question} onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })} />
                <textarea rows={2} className={inp} placeholder="Answer" value={newFaq.answer} onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })} />
                <button
                  onClick={() => newFaq.question && newFaq.answer && faqCreate.mutate(newFaq)}
                  className="grid h-9 w-9 place-items-center rounded-lg bg-blush-500/20 text-blush-200 hover:bg-blush-500/30" title="Add"
                ><FiPlus size={15} /></button>
              </div>
            </div>
          </div>
        )}
      </Panel>

      {save.isSuccess && <p className="mt-4 text-sm text-emerald-300">Saved! The storefront updates on next load.</p>}
    </>
  );
}
