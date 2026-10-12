import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Article bodies are untrusted. react-markdown never renders raw HTML (no rehype-raw), and every
// link/image URL passes through safeUrl, so script, iframe, on* handlers and javascript: URLs cannot
// reach the page.

const SAFE_PROTOCOLS = new Set(["https:", "http:", "mailto:"]);

export function safeUrl(url: string): string {
  if (url.startsWith("/") && !url.startsWith("//")) return url; // site path
  if (url.startsWith("#")) return url;
  try {
    const u = new URL(url);
    return SAFE_PROTOCOLS.has(u.protocol) ? u.toString() : "";
  } catch {
    return "";
  }
}

const components: Components = {
  a({ href, children }) {
    const url = href ? safeUrl(href) : "";
    if (!url) return <>{children}</>;
    if (url.startsWith("/") || url.startsWith("#")) {
      return (
        <Link href={url} className="font-semibold text-brand-primary underline underline-offset-2">
          {children}
        </Link>
      );
    }
    return (
      <a href={url} target="_blank" rel="noopener noreferrer nofollow" className="font-semibold text-brand-primary underline underline-offset-2">
        {children}
      </a>
    );
  },
  img({ src, alt }) {
    const url = typeof src === "string" ? safeUrl(src) : "";
    if (!url) return null;
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary storage hosts; sizes unknown
    return <img src={url} alt={alt ?? ""} loading="lazy" className="my-4 h-auto w-full rounded-card" />;
  },
  table({ children }) {
    return (
      <div className="my-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    );
  },
  th: ({ children }) => <th className="border border-border bg-surface-subtle px-3 py-2 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border border-border px-3 py-2">{children}</td>,
  h1: ({ children }) => <h2 className="mt-8 text-xl text-brand-primary">{children}</h2>,
  h2: ({ children }) => <h2 className="mt-8 text-xl text-brand-primary">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 text-lg text-brand-primary">{children}</h3>,
  h4: ({ children }) => <h4 className="mt-4 text-base text-brand-primary">{children}</h4>,
  p: ({ children }) => <p className="my-3 leading-8 text-ink">{children}</p>,
  ul: ({ children }) => <ul className="my-3 list-disc space-y-1 pl-6 text-ink">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-6 text-ink">{children}</ol>,
  blockquote: ({ children }) => <blockquote className="my-4 border-l-4 border-brand-accent bg-surface-subtle px-4 py-2">{children}</blockquote>,
  code: ({ children }) => <code className="rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-sm">{children}</code>,
  pre: ({ children }) => <pre className="my-4 overflow-x-auto rounded-xl bg-surface-subtle p-4 text-sm">{children}</pre>,
};

export function SafeMarkdown({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml urlTransform={safeUrl} components={components}>
      {markdown}
    </ReactMarkdown>
  );
}
