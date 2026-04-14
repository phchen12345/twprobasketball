import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
  {
    variants: {
      variant: {
        default: "border-white/15 bg-white/10 text-white",
        dark: "border-slate-900 bg-slate-950 text-white",
        muted: "border-slate-200 bg-slate-100 text-slate-600",
        accent: "border-amber-200 bg-amber-500 text-white",
        home: "border-transparent bg-[#0f4c81] text-white",
        away: "border-transparent bg-[#f2f2f3] text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
