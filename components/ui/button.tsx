import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-white/90",
        secondary: "bg-white/10 text-white hover:bg-white/15",
        outline: "border border-white/15 bg-transparent text-white hover:bg-white/5",
        ghost: "text-white hover:bg-white/8",
        pill: "rounded-full border border-white/15 bg-white/8 text-white backdrop-blur-sm hover:bg-white/14",
        google:
          "rounded-full border border-white/20 bg-white text-black shadow-[0_12px_30px_rgba(255,255,255,0.14)] hover:bg-white/90 focus-visible:ring-white/40",
        accent:
          "rounded-full bg-[#d97706] text-white shadow-[0_12px_32px_rgba(217,119,6,0.35)] hover:bg-[#c26a05]",
        slate:
          "rounded-full border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-900",
        ivory:
          "rounded-full border border-stone-200 bg-white text-slate-700 hover:bg-stone-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        pill: "h-10 px-5",
        google: "h-9 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
