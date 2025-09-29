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
      <title>AstroBio Explorer Logo</title>
      <path d="M12.5 4.5a8.48 8.48 0 0 0-4.24 1.76" />
      <path d="M15.24 5.26a8.48 8.48 0 0 0-4.24-1.76" />
      <path d="M11.5 8.5a8.48 8.48 0 0 0-4.24 1.76" />
      <path d="M14.24 9.26a8.48 8.48 0 0 0-4.24-1.76" />
      <path d="M10.5 12.5a8.48 8.48 0 0 0-4.24 1.76" />
      <path d="M13.24 13.26a8.48 8.48 0 0 0-4.24-1.76" />
      <path d="M9.5 16.5a8.48 8.48 0 0 0-4.24 1.76" />
      <path d="M12.24 17.26a8.48 8.48 0 0 0-4.24-1.76" />
      <path d="M5.26 8.76A8.48 8.48 0 0 0 3.5 12.5" />
      <path d="M5.26 15.24A8.48 8.48 0 0 0 3.5 11.5" />
      <path d="M8.76 18.74a8.48 8.48 0 0 0 1.76 4.24" />
      <path d="M8.76 5.26a8.48 8.48 0 0 0 1.76-4.24" />
      <path d="m14 4 3.09 1.41.91 3.28-2 1.81" />
      <path d="m18 8-2.5 2.5" />
      <path d="M18 13.01V15l-4 4-2-2" />
      <path d="M15.24 18.74A8.48 8.48 0 0 0 17 14.5" />
      <path d="M18.74 15.24A8.48 8.48 0 0 0 14.5 17" />
    </svg>
  );
}
