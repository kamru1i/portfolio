"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";

const Sheet = BaseDialog.Root;
const SheetTrigger = BaseDialog.Trigger;
const SheetClose = BaseDialog.Close;
const SheetPortal = BaseDialog.Portal;

const SheetBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseDialog.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/75 backdrop-blur-xs transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
      className
    )}
    {...props}
  />
));
SheetBackdrop.displayName = "SheetBackdrop";

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseDialog.Popup> {
  side?: "left" | "right";
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = "left", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetBackdrop />
      <BaseDialog.Popup
        ref={ref}
        className={cn(
          "fixed inset-y-0 z-50 flex h-screen h-dvh flex-col bg-[#111114] border-white/15 text-white shadow-2xl transition-transform duration-200 focus:outline-none select-none",
          side === "left"
            ? "left-0 w-[268px] max-w-[85vw] border-r data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full"
            : "right-0 w-[280px] max-w-[85vw] border-l data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full",
          className
        )}
        {...props}
      >
        {children}
      </BaseDialog.Popup>
    </SheetPortal>
  )
);
SheetContent.displayName = "SheetContent";

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseDialog.Title
    ref={ref}
    className={cn("font-sans text-sm font-medium text-white", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

export {
  Sheet,
  SheetPortal,
  SheetBackdrop,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetTitle,
};
