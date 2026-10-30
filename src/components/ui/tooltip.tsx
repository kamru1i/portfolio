"use client";

import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";

const TooltipProvider = BaseTooltip.Provider;
const Tooltip = BaseTooltip.Root;
const TooltipTrigger = BaseTooltip.Trigger;

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Popup> & {
    sideOffset?: number;
  }
>(({ className, sideOffset = 6, children, ...props }, ref) => (
  <BaseTooltip.Portal>
    <BaseTooltip.Positioner sideOffset={sideOffset} className="z-50">
      <BaseTooltip.Popup
        ref={ref}
        className={cn(
          "z-50 overflow-hidden rounded-lg bg-[#18181b] border border-white/15 px-2.5 py-1 font-mono-custom text-[11px] text-white shadow-lg transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          className
        )}
        {...props}
      >
        {children}
      </BaseTooltip.Popup>
    </BaseTooltip.Positioner>
  </BaseTooltip.Portal>
));
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
