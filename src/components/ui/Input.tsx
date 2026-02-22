"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm shadow-sm transition-all placeholder:text-neutral-400 focus:border-[#ff0000]/40 focus:outline-none focus:ring-2 focus:ring-[#ff0000]/20 dark:border-[#3f3f3f] dark:bg-[#272727] dark:placeholder:text-neutral-500 dark:focus:border-[#ff0000]/50 dark:focus:ring-[#ff0000]/20",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
