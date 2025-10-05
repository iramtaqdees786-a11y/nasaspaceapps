import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-8 h-8", className)}
    >
      <title>Cellestial Logo</title>
      <path d="M12.5 4.5a8.48 8.48 0 0 0-4.24 1.76" />
      <path d="M15.24 5.26a8.48 8.48 0 0 0-4.24-1.76" />
      <path d="M11.5 8.5a8.48 8.48 0 0 0-4.24 1.76" />
      <path d="M14.24 9.26a8.48 8.48 0 0 0-4.24-1.76" />
      <path d="M10.5 12.5a8.48 8.48 0 0 0-4.24 1.76" />
      <path d="M13.24 13.26a8.48 8.48 0 0 0-4.24-1.76" />
      <path d="M9.5 16.5a8.48 8.48 0 0 0-4.24 1.76" />
      <path d="M12.24 17.26a8.48 8.48 0 0 0-4.24-1.76" />
      <path d="M17.74 7.5a4.24 4.24 0 0 0-1.26-1.26" />
      <path d="M13.76 9.5a4.24 4.24 0 0 0-1.26-1.26" />
      <path d="M18.74 11.5a4.24 4.24 0 0 0-1.26-1.26" />
      <path d="M14.76 13.5a4.24 4.24 0 0 0-1.26-1.26" />
      <path d="M19.74 15.5a4.24 4.24 0 0 0-1.26-1.26" />
      <path d="M15.76 17.5a4.24 4.24 0 0 0-1.26-1.26" />
    </svg>
  );
}
