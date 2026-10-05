// Shared between the registration form and its API route.

export const RESTAURANT_CATEGORIES = [
  "อาหารไทย", "อาหารจีน", "อาหารญี่ปุ่น", "อาหารอีสาน",
  "อาหารตะวันตก", "อาหารทะเล", "ของหวาน/เบเกอรี่", "เครื่องดื่ม", "อื่น ๆ",
] as const;

// Bump when the PDPA text on /register-restaurant changes.
export const CONSENT_VERSION = "2026-10-05";

export type RestaurantApplicationInput = {
  restaurantName: string;
  contactName: string;
  phone: string;
  email: string;
  category: string;
  address: string;
};

export type FieldErrors = Partial<Record<keyof RestaurantApplicationInput, string>>;

export const LIMITS = { name: 120, address: 300, email: 254 } as const;

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, "");
}

export function validateApplication(input: RestaurantApplicationInput): FieldErrors {
  const errors: FieldErrors = {};
  const t = (v: string) => v.trim();

  if (!t(input.restaurantName)) errors.restaurantName = "กรุณากรอกชื่อร้าน";
  else if (t(input.restaurantName).length > LIMITS.name) errors.restaurantName = "ชื่อร้านยาวเกินไป";

  if (!t(input.contactName)) errors.contactName = "กรุณากรอกชื่อผู้ติดต่อ";
  else if (t(input.contactName).length > LIMITS.name) errors.contactName = "ชื่อยาวเกินไป";

  if (!/^0\d{8,9}$/.test(normalizePhone(input.phone))) errors.phone = "เบอร์โทรไม่ถูกต้อง (เช่น 0812345678)";

  const email = t(input.email);
  if (!email || email.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "อีเมลไม่ถูกต้อง";
  }

  if (!(RESTAURANT_CATEGORIES as readonly string[]).includes(input.category)) errors.category = "กรุณาเลือกประเภทอาหาร";

  if (!t(input.address)) errors.address = "กรุณากรอกที่อยู่ร้าน";
  else if (t(input.address).length > LIMITS.address) errors.address = "ที่อยู่ยาวเกินไป";

  return errors;
}
