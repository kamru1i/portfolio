"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
  "aria-label"?: string;
}

export function Checkbox({
  id,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  required,
  name,
  className,
  "aria-label": ariaLabel,
}: CheckboxProps) {
  return (
    <BaseCheckbox.Root
      id={id}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(val) => onCheckedChange?.(Boolean(val))}
      disabled={disabled}
      required={required}
      name={name}
      aria-label={ariaLabel}
      className={cn(
        "peer inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-white/25 bg-black/50 text-black transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 data-[checked]:bg-white data-[checked]:border-white disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <BaseCheckbox.Indicator className="flex items-center justify-center text-black">
        <Check className="h-3 w-3 stroke-[2.75]" aria-hidden="true" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
