import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "border-sky-400/30 bg-sky-500/10 text-sky-200",
        neutral: "border-border bg-secondary/80 text-foreground",
        success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
        warning: "border-amber-400/30 bg-amber-500/10 text-amber-300",
        danger: "border-rose-400/30 bg-rose-500/10 text-rose-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
