import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-14 w-full rounded-2xl border border-input bg-card px-4 text-base text-foreground shadow-xs transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/15 disabled:opacity-60",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
