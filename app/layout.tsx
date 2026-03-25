/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mrhavefood.com"),
  title: {
    default: "MrHaveFood",
    template: "%s | MrHaveFood",
  },
  description:
    "MrHaveFood.com helps Thai food lovers compare delivery prices, verify truth with real receipts, and discover worth-it zones through a visual savings map.",
  applicationName: "MrHaveFood.com",
  keywords: [
    "MrHaveFood",
    "food price comparison",
    "delivery comparison Thailand",
    "receipt OCR food review",
    "worth-it heatmap",
    "Bangkok food deals",
  ],
  authors: [{ name: "MrHaveFood" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MrHaveFood.com | Smart Layer for Savvy Eaters",
    description:
      "Compare food delivery prices, verify reviews with real receipts, and find the most worth-it meals in each district.",
    url: "https://mrhavefood.com",
    siteName: "MrHaveFood.com",
    type: "website",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "MrHaveFood.com",
    description:
      "Compare smarter. Eat better. Pay less. A value-first food discovery layer for Thailand.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f6f0e1",
  colorScheme: "light dark",
};

const themeBootScript = `
(() => {
  try {
    const storedTheme = window.localStorage.getItem("mr-have-food-theme");
    const theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light";
    document.documentElement.dataset.theme = theme;
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className="scroll-smooth"
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@600&family=Kanit:wght@700&family=Mitr:wght@500&family=Prompt:wght@400&display=swap"
        />
      </head>
      <body className="overflow-x-hidden bg-background font-sans text-foreground antialiased">
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
