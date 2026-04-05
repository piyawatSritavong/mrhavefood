import type { Metadata, Viewport } from "next";
import { Inter, Kanit, Mitr, Prompt } from "next/font/google";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { FloatingAIButton } from "@/components/floating-ai-button";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
  display: "swap",
});

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["700"],
  variable: "--font-kanit",
  display: "swap",
});

const mitr = Mitr({
  subsets: ["thai", "latin"],
  weight: ["500"],
  variable: "--font-mitr",
  display: "swap",
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["400"],
  variable: "--font-prompt",
  display: "swap",
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MrHaveFood",
  url: "https://mrhavefood.com",
  logo: "https://mrhavefood.com/icon.svg",
  description:
    "MrHaveFood.com helps Thai food lovers compare delivery prices, verify truth with real receipts, and discover worth-it zones through a visual savings map.",
  sameAs: ["https://www.mrhavefood.com"],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mrhavefood.com"),
  title: {
    default: "MrHaveFood — เปรียบราคาส่งอาหาร ทุกแพลตฟอร์ม ในไทย",
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
      className={`scroll-smooth ${inter.variable} ${kanit.variable} ${mitr.variable} ${prompt.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="overflow-x-hidden bg-background font-sans text-foreground antialiased">
        <AuthSessionProvider>
          {children}
          <FloatingAIButton />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
