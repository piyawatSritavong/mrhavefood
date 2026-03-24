import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MrHaveFood.com",
    short_name: "MrHaveFood",
    description:
      "Smart Layer for Savvy Eaters. Compare delivery prices, verify receipts, and discover worth-it food zones.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f0e1",
    theme_color: "#f6f0e1",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
