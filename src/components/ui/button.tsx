import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black font-sans hover:bg-neutral-200 active:scale-[0.98] shadow-sm",
        secondary:
          "bg-white/6 hover:bg-white/12 text-white font-mono-custom border border-white/10 hover:border-white/20",
        outline:
          "bg-transparent hover:bg-white/8 text-white font-mono-custom border border-white/12 hover:border-white/25",
        ghost:
          "bg-transparent hover:bg-white/8 text-[#a1a1a1] hover:text-white font-mono-custom",
        destructive:
          "bg-red-950/35 hover:bg-red-900/45 text-red-300 hover:text-red-200 font-mono-custom border border-red-800/35 hover:border-red-700/50 focus-visible:ring-red-400/50",
        destructiveSolid:
          "bg-red-600 hover:bg-red-500 text-white font-mono-custom shadow-sm focus-visible:ring-red-400/50",
        success:
          "bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-mono-custom border border-emerald-800/40",
        warning:
          "bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 font-mono-custom border border-amber-800/40",
        pill:
          "rounded-full bg-white text-black font-sans hover:bg-neutral-200 active:scale-[0.98] shadow-sm",
        pillSecondary:
          "rounded-full bg-white/8 hover:bg-white/15 text-white font-mono-custom border border-white/10 hover:border-white/25",
        link: "text-white underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 px-2.5 py-1 text-[11px] rounded-lg",
        sm: "h-8 px-3 py-1.5 text-xs rounded-lg",
        lg: "h-11 px-6 py-3 text-xs sm:text-sm",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-8 w-8 p-0 rounded-lg",
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
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
