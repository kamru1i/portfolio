"use client";

import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = BaseAccordion.Root;

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Item>
>(({ className, ...props }, ref) => (
  <BaseAccordion.Item
    ref={ref}
    className={cn(
      "group rounded-2xl bg-[#161616] hover:bg-[#1b1b1b] border border-white/10 hover:border-white/20 transition-colors duration-200 shadow-md overflow-hidden",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseAccordion.Header className="flex">
    <BaseAccordion.Trigger
      ref={ref}
      className={cn(
        "group/trigger w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl",
        className
      )}
      {...props}
    >
      <span className="font-sans text-base sm:text-lg font-medium text-white tracking-tight group-hover:text-white/95">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="w-8 h-8 rounded-full bg-white/6 border border-white/10 flex items-center justify-center shrink-0 text-white group-hover:bg-white/12 transition-colors"
      >
        <Plus className="h-4 w-4 block group-data-[panel-open]/trigger:hidden" />
        <Minus className="h-4 w-4 hidden group-data-[panel-open]/trigger:block" />
      </span>
    </BaseAccordion.Trigger>
  </BaseAccordion.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Panel>
>(({ className, children, ...props }, ref) => (
  <BaseAccordion.Panel
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all px-5 sm:px-6 pb-5 sm:pb-6",
      className
    )}
    {...props}
  >
    <div className="pt-4 border-t border-white/10 font-mono-custom text-sm sm:text-[15px] text-[#a1a1a1] leading-relaxed">
      {children}
    </div>
  </BaseAccordion.Panel>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
