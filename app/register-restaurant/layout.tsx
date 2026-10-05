import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ลงทะเบียนร้านอาหาร",
  description: "ลงทะเบียนร้านอาหารกับ MrHaveFood ฟรี ไม่มีค่า GP ลูกค้าสั่งตรงผ่าน LINE ของร้าน",
  alternates: { canonical: "/register-restaurant" },
};

export default function RegisterRestaurantLayout({ children }: { children: React.ReactNode }) {
  return children;
}
