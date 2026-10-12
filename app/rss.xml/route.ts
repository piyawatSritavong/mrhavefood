import { articlePath, escapeXml, indexable } from "@/lib/autopost/feeds";
import { listPublishedArticles } from "@/lib/autopost/queries";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 300;

export async function GET() {
  const articles = (await listPublishedArticles({ limit: 50 })).filter(indexable);
  const items = articles
    .map((a) => {
      const url = `${SITE_URL}${articlePath(a)}`;
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>${a.category ? `\n      <category>${escapeXml(a.category)}</category>` : ""}
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} — บทความ</title>
    <link>${SITE_URL}/articles</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>th</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
