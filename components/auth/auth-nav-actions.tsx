import Link from "next/link";

export function AuthNavActions() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/register-restaurant"
        className="rounded-full bg-[#111111] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80 sm:px-5 sm:py-2.5 sm:text-sm"
      >
        Restaurant
      </Link>
    </div>
  );
}
