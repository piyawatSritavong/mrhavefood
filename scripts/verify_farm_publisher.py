"""Post a real article to the local receiver with the farm's own SitePublisher (round-web-seo §1.4).

    BASE_URL=http://localhost:3125 AUTOPOST_SITE_SECRET=<test secret> \
      ../AI-Automation-Farm/.venv/bin/python scripts/verify_farm_publisher.py

Only for a local server in PROMOTIONS_TEST_MODE=1. Never point it at production.
"""
from __future__ import annotations

import asyncio
import os
import re
import sys
import uuid
from pathlib import Path

FARM_SRC = Path(os.environ.get("FARM_SRC", Path(__file__).resolve().parents[2] / "AI-Automation-Farm" / "src"))
sys.path.insert(0, str(FARM_SRC))

import httpx  # noqa: E402  (from the farm's venv)
from farm.config import PublisherConfig  # noqa: E402
from farm.publishers import SitePublisher  # noqa: E402

BASE = os.environ.get("BASE_URL", "http://localhost:3125")
COVER = Path(__file__).resolve().parents[1] / "public" / "icon-512.png"


async def main() -> None:
    run = uuid.uuid4().hex[:8]
    slug = f"farm-{run}-lineman-promo"
    item = {
        "kind": "article.mrhavefood",
        "title": "รวมโค้ด LINE MAN ที่ใช้ได้สัปดาห์นี้",
        "dedupe_key": f"auto-content:mrhavefood:article:{slug}:v1",
        "files": [{"path": str(COVER), "role": "image"}],
    }
    target = {
        "publisher": "web:mrhavefood",
        "data": {
            "article": {
                "slug": slug,
                "title": "รวมโค้ด LINE MAN ที่ใช้ได้สัปดาห์นี้",
                "excerpt": "สรุปโค้ด LINE MAN ที่ยังใช้ได้ พร้อมเงื่อนไขจากหน้าโปรทางการ",
                "body_markdown": "## โค้ดที่ใช้ได้\n\n- **NEW40** ลด 40 บาท สำหรับผู้ใช้ใหม่\n\n![ปก](asset://icon-512.png)\n\nดูโปรทั้งหมดที่ [หน้าโปร LINE MAN](/promo/lineman)",
                "category": "promotions",
                "tags": ["lineman", "โค้ดส่วนลด"],
                "author": {"name": "MrHaveFood Team", "persona": None},
                "faq": [{"q": "โค้ด NEW40 ใช้ได้กับใคร", "a": "ผู้ใช้ใหม่ที่สั่งขั้นต่ำ 150 บาท"}],
                "sources": [{"title": "LINE MAN Promotion", "url": "https://lineman.line.me/promotion"}],
                "internal_links": [{"anchor": "โปร LINE MAN", "path": "/promo/lineman"}],
                "seo": {"meta_title": "โค้ด LINE MAN สัปดาห์นี้", "keywords": ["โค้ด lineman"], "canonical_url": None, "noindex": False},
                "disclosure": None,
            }
        },
    }
    cfg = PublisherConfig(name="web:mrhavefood", type="site", options={"url": BASE, "secret_env": "AUTOPOST_SITE_SECRET"})
    async with httpx.AsyncClient() as client:
        pub = SitePublisher(cfg, client)
        health = await pub.health()
        print("health:", health)
        assert health == {"ok": True, "site": "mrhavefood", "spp": 1, "sections": ["articles", "reviews"]}, health

        url = await pub.publish(item, target)
        print("published:", url)
        assert url.endswith(f"/articles/{slug}"), url

        again = await pub.publish(item, target)  # same Idempotency-Key + body → same result
        assert again == url, again

        page = await client.get(f"{BASE}/articles/{slug}")
        assert page.status_code == 200, page.status_code
        html = page.text
        for needle in ('"@type":"Article"', '"@type":"FAQPage"', "แหล่งอ้างอิง", "/api/autopost/media/"):
            assert needle in html, needle
        assert "asset://" not in html, "asset:// must be rewritten to a public URL"
        media = re.search(r'src="(/api/autopost/media/[^"]+)"', html)
        assert media, "cover image tag"
        img = await client.get(f"{BASE}{media.group(1)}")
        assert img.status_code == 200 and img.headers["content-type"] == "image/png", img.status_code
        print("page ok, cover image served, replay idempotent")


if __name__ == "__main__":
    asyncio.run(main())
