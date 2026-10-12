import { articlePath, indexable, oneLine } from "@/lib/autopost/feeds";
import { listPublishedArticles } from "@/lib/autopost/queries";
import { platformMeta } from "@/lib/promotions-data";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 300;

// llms.txt (https://llmstxt.org): a plain map of the site for AI answer engines.
export async function GET() {
  const articles = (await listPublishedArticles({ limit: 200 })).filter(indexable);
  const line = (title: string, url: string, summary: string) => `- [${oneLine(title, 150)}](${url}): ${oneLine(summary)}`;
  const text = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "ข้อมูลโปรโมชั่นมาจากหน้าโปรทางการของแต่ละแอปหรือ feed ของโปรแกรม affiliate เท่านั้น โปรที่หมดอายุจะถูกซ่อนอัตโนมัติ",
    "",
    "## โปรโมชั่นแยกตามแอป",
    "",
    line("โปรล่าสุดทุกแอป", SITE_URL, "รายการโค้ดส่วนลดที่ยังใช้ได้ อัปเดตทุก 6 ชั่วโมง"),
    ...Object.values(platformMeta).map((m) => line(`โค้ดส่วนลด ${m.label}`, `${SITE_URL}/promo/${m.slug}`, `โปร ${m.label} ที่ยังใช้ได้วันนี้`)),
    "",
    "## บทความและรีวิว",
    "",
    ...(articles.length
      ? articles.map((a) => line(a.title, `${SITE_URL}${articlePath(a)}`, a.excerpt || a.title))
      : ["- ยังไม่มีบทความ"]),
    "",
  ].join("\n");
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
