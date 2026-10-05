import Link from "next/link";

export function HeaderCta() {
  return (
    <Link
      href="/register-restaurant"
      className="inline-flex min-h-11 items-center rounded-full bg-brand-primary px-4 text-sm font-semibold text-inverse transition-colors hover:bg-brand-primary-hover sm:px-5"
    >
      <span className="sm:hidden">ลงทะเบียนร้าน</span>
      <span className="hidden sm:inline">ลงทะเบียนร้านอาหาร</span>
    </Link>
  );
}
