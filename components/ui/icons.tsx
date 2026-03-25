import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </BaseIcon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.5-3.5" />
    </BaseIcon>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z" />
      <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
      <path d="m5 14 .6 1.7L7.3 16l-1.7.6L5 18.3l-.6-1.7L2.7 16l1.7-.3L5 14Z" />
    </BaseIcon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </BaseIcon>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 11.5 20.5 4 13 21l-2.3-6.1L3 11.5Z" />
      <path d="M10.7 14.9 20.5 4" />
    </BaseIcon>
  );
}

export function PercentIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m6 19 12-14" />
      <circle cx="8" cy="8" r="2" />
      <circle cx="16" cy="16" r="2" />
    </BaseIcon>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 6h10v9H3z" />
      <path d="M13 9h4l3 3v3h-7Z" />
      <circle cx="7.5" cy="18" r="1.5" />
      <circle cx="17.5" cy="18" r="1.5" />
    </BaseIcon>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9 15 1.7-5.7L16.5 7l-1.7 5.7L9 15Z" />
    </BaseIcon>
  );
}

export function UtensilsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6 3v8" />
      <path d="M8.5 3v8" />
      <path d="M6 7.5h2.5" />
      <path d="M7.25 11.5V21" />
      <path d="M15 3c2 2.3 2 5.4 0 7.7V21" />
    </BaseIcon>
  );
}

export function MessageSquareIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6 18H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-8l-4 3v-3Z" />
    </BaseIcon>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3 5 6v5c0 4.8 3.1 7.9 7 10 3.9-2.1 7-5.2 7-10V6l-7-3Z" />
      <path d="m9.5 12 1.8 1.8 3.7-4" />
    </BaseIcon>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="4" y="4" width="6" height="6" rx="1.2" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" />
    </BaseIcon>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </BaseIcon>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </BaseIcon>
  );
}

export function AiEyeIcon(props: IconProps) {
  return (
    <BaseIcon strokeWidth="1.6" {...props}>
      {/* eyelid curve */}
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      {/* iris */}
      <circle cx="12" cy="12" r="3" />
      {/* pupil dot */}
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      {/* AI spark top-right */}
      <path d="M18 5.5 19 7l1.5.5L19 8l-1 1.5L17 8l-1.5-.5L17 7Z" strokeWidth="1" />
    </BaseIcon>
  );
}
