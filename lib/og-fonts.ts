type FontWeight = 400 | 700;

const cache = new Map<string, Promise<ArrayBuffer | null>>();

/**
 * Loads a Google Font subset (only the glyphs in `text`) as TTF for next/og,
 * which cannot use woff2 and has no Thai glyphs of its own.
 */
export function loadGoogleFont(family: string, weight: FontWeight, text: string): Promise<ArrayBuffer | null> {
  const key = `${family}:${weight}:${text}`;
  let hit = cache.get(key);
  if (!hit) {
    hit = (async () => {
      try {
        const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
        const css = await (await fetch(url)).text();
        const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
        if (!src) return null;
        const res = await fetch(src[1]);
        return res.ok ? await res.arrayBuffer() : null;
      } catch {
        return null;
      }
    })();
    if (cache.size > 50) cache.clear();
    cache.set(key, hit);
  }
  return hit;
}
