import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono-custom text-[10px] uppercase tracking-wider transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-white/8 text-white/90 border-white/12",
        secondary: "bg-white/4 text-[#aaa] border-white/10",
        muted: "bg-white/4 text-[#888] border-white/8",
        outline: "bg-transparent text-white/80 border-white/15",
        success: "bg-emerald-950/50 text-emerald-300 border-emerald-800/50",
        warning: "bg-amber-950/50 text-amber-300 border-amber-800/50",
        danger: "bg-red-950/50 text-red-300 border-red-800/50",
        info: "bg-sky-950/50 text-sky-300 border-sky-800/50",
        purple: "bg-purple-950/50 text-purple-300 border-purple-800/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
