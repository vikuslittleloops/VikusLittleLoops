import { useEffect, useState } from "react";

/**
 * Crossfading slideshow — cycles through photos automatically.
 * Used for the hero strip and the homepage gallery (admin-uploaded).
 */
export default function Slideshow({ photos = [], interval = 1000, className = "", imgClassName = "" }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % photos.length), interval);
    return () => clearInterval(t);
  }, [photos.length, interval]);

  if (!photos.length) return null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {photos.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt=""
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            i === idx ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
        />
      ))}
    </div>
  );
}
