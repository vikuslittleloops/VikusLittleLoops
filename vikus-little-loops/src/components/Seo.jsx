// React 19 hoists <title>/<meta>/<link> rendered anywhere into <head>,
// so this component just renders the tags for the current page.

const SITE = "Viku's Little Loops";
const DEFAULT_DESC =
  "Handmade luxury crochet accessories designed to make every moment memorable.";

export default function Seo({ title, description, image, url, type = "website" }) {
  const fullTitle = title ? `${title} · ${SITE}` : `${SITE} — Handmade With Love, Crafted Forever`;
  const desc = description || DEFAULT_DESC;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />

      <meta property="og:site_name" content={SITE} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
    </>
  );
}
