import * as React from "react";
import { cn } from "@/lib/utils/helpers";

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "outline" | "vibe" }
>(({ className, variant = "default", ...props }, ref) => {
  const variants: Record<string, string> = {
    default: "bg-primary-600 text-white",
    secondary: "bg-gray-100 text-gray-700",
    outline: "border border-gray-300 text-gray-700",
    vibe: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
