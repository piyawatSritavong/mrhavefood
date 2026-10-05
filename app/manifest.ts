import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME}.com`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: "th",
    start_url: "/",
    display: "standalone",
    // Mirrors --background in app/globals.css.
    background_color: "#f4eeee",
    theme_color: "#f4eeee",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
