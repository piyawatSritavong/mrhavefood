export const merchantConsole = {
  shop: {
    name: "กะเพราโคตรดึก",
    district: "Thonglor",
    claimStatus: "Verified owner",
    worthScore: 8.9,
    responseRate: "94%",
  },
  metrics: [
    {
      label: "Comparisons this week",
      value: "1,842",
      note: "ลูกค้าเอาไปเทียบกับร้านรอบข้างบ่อยสุดช่วง 20:00-23:00",
    },
    {
      label: "Worth-it win rate",
      value: "67%",
      note: "ชนะราคา net ใน 2 จาก 3 เคสเมื่อเทียบคู่แข่งโซนเดียวกัน",
    },
    {
      label: "Direct deal redemptions",
      value: "128",
      note: "โปรหน้าร้านเริ่มดึง traffic กลับเข้า dine-in และ pickup ได้จริง",
    },
    {
      label: "Verified review replies",
      value: "21",
      note: "คำตอบของร้านต่อรีวิวที่มีใบเสร็จยืนยันแล้วในรอบ 14 วัน",
    },
  ],
  competitors: [
    {
      scenario: "กะเพราเนื้อ + ไข่ดาว",
      yourNetPrice: 169,
      rivalName: "กะเพราไฟลุกเอกมัย",
      rivalNetPrice: 176,
      position: "Cheapest today",
    },
    {
      scenario: "กะเพราเนื้อ + ไข่ดาว",
      yourNetPrice: 169,
      rivalName: "ครัวดึกพร้อมส่ง",
      rivalNetPrice: 182,
      position: "ชนะทั้งราคาและ ETA",
    },
    {
      scenario: "ข้าวกะเพราไก่กรอบ",
      yourNetPrice: 148,
      rivalName: "กะเพรากระทะร้อน 24 ชม.",
      rivalNetPrice: 141,
      position: "แพ้ราคา ต้องดัน direct deal",
    },
  ],
  shopClaimChecklist: [
    { title: "ยืนยันเบอร์โทรร้าน", done: true },
    { title: "เชื่อมบัญชีรับโปร direct deal", done: true },
    { title: "อัปโหลดเมนูหน้าร้านล่าสุด", done: false },
    { title: "ตั้งกฎตอบรีวิว Verified", done: true },
  ],
  directDeals: [
    {
      title: "รับหน้าร้าน ลด 12%",
      channel: "Walk-in / Pickup",
      status: "Live",
      expires: "คืนนี้ 23:30",
      note: "เน้นดึงลูกค้าที่เห็นว่าราคาในแอปสูงเกินไป",
    },
    {
      title: "ซื้อ 2 กล่อง แถมไข่ดาว",
      channel: "Pickup only",
      status: "Queued",
      expires: "เริ่มพรุ่งนี้ 11:00",
      note: "ใช้กับมื้อเที่ยงออฟฟิศเพื่อดัน AOV",
    },
  ],
  verifiedReviews: [
    {
      author: "Mint A.",
      summary: "รสชาติจัดเหมือนเดิม แต่วันนี้ LINE MAN ถูกกว่าชัดเจน",
      status: "Awaiting response",
      trust: "Verified receipt",
    },
    {
      author: "Non K.",
      summary: "รับหน้าร้านเร็วกว่าเดลิเวอรี่และ portion ค่อนข้างแน่น",
      status: "Responded",
      trust: "Verified dine-in",
    },
    {
      author: "Ploy T.",
      summary: "ถ้ามีโปร pickup จะคุ้มมากสำหรับช่วงดึก",
      status: "Flagged as opportunity",
      trust: "Verified pickup",
    },
  ],
};

export const platformConsole = {
  metrics: [
    { label: "Active members", value: "14,280", note: "Bangkok-first cohort" },
    { label: "Receipts in queue", value: "318", note: "รวม processing และ human review" },
    { label: "OCR accuracy", value: "93.4%", note: "7 วันล่าสุดหลัง human correction" },
    { label: "Affiliate outflow", value: "฿412k", note: "GMV proxy จาก traffic handoff" },
  ],
  trendingStores: [
    { name: "เฮียช้าง ข้าวมันไก่อารีย์", district: "Ari", reason: "ราคา net ต่ำลง 2 วันติด" },
    { name: "เรือเข้มท่าอ่อนนุช", district: "Onnut", reason: "receipt verified เพิ่ม 34%" },
    { name: "โรตีหน้าโค้งเอกมัย", district: "Ekkamai", reason: "conversion ไป ShopeeFood สูงสุด" },
  ],
  ocrQueue: [
    {
      fileName: "ari-lunch-proof.jpg",
      extracted: "ข้าวมันไก่ + ชาเย็น / LINE MAN / ฿128",
      confidence: "96%",
      status: "Auto-approved",
    },
    {
      fileName: "late-night-krapao.png",
      extracted: "กะเพราเนื้อ + ไข่ดาว / Grab / ฿182",
      confidence: "81%",
      status: "Needs human check",
    },
    {
      fileName: "onnut-noodle-bill.jpeg",
      extracted: "ก๋วยเตี๋ยวเรือ + เกี๊ยวทอด / ShopeeFood / ฿145",
      confidence: "89%",
      status: "Queued",
    },
  ],
  affiliateLinks: [
    { channel: "Grab deep link", ctr: "8.2%", revenue: "฿48,200", status: "Healthy" },
    { channel: "LINE MAN handoff", ctr: "10.9%", revenue: "฿61,700", status: "Best performer" },
    { channel: "ShopeeFood fallback", ctr: "6.4%", revenue: "฿31,100", status: "Needs optimization" },
  ],
  fraudCases: [
    {
      signal: "Duplicate receipt hash",
      account: "member+batch-17@demo",
      severity: "High",
      action: "Hold points and send to review",
    },
    {
      signal: "Review burst from same IP",
      account: "store-promo-wave",
      severity: "Medium",
      action: "Throttle submissions 24h",
    },
    {
      signal: "Price mismatch vs platform average",
      account: "late-night-krapao",
      severity: "Low",
      action: "Ask for second proof",
    },
  ],
  moderationQueue: [
    {
      source: "Verified review",
      target: "โรตีหน้าโค้งเอกมัย",
      issue: "ภาษาก้าวร้าว",
      status: "Pending decision",
    },
    {
      source: "Merchant response",
      target: "กะเพราโคตรดึก",
      issue: "โปรโมชันเกินจริง",
      status: "Needs edit",
    },
    {
      source: "Receipt note",
      target: "เฮียช้าง ข้าวมันไก่อารีย์",
      issue: "ข้อมูลส่วนบุคคลโผล่ในภาพ",
      status: "Mask and approve",
    },
  ],
};
