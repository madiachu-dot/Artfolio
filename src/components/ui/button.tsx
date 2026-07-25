import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:brightness-110",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-full px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-full px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-full px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      disabled={disabled || loading}
      className={cn(
        buttonVariants({ variant, size, className }),
        loading &&
          "border border-primary bg-background text-primary hover:bg-background disabled:opacity-100",
      )}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && (
            <svg
              className="h-4! w-6! shrink-0"
              viewBox="0 5 24 10"
              fill="none"
              aria-hidden="true"
            >
              <title>Loading</title>
              <path
                d="M12 12C11 8 7.5 6 4.5 6.5C1.5 7 0.5 10.5 2.5 12.5C4.2 14.2 7 14 8.5 12.8C9.5 12 9.8 10.8 8.8 10.2C7.8 9.6 6.5 10.2 6.6 11.3C6.7 12.3 8 12.8 8.8 12.2"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "right center",
                  animation: "wing-flap 0.9s ease-in-out infinite",
                }}
              />
              <path
                d="M12 12C13 8 16.5 6 19.5 6.5C22.5 7 23.5 10.5 21.5 12.5C19.8 14.2 17 14 15.5 12.8C14.5 12 14.2 10.8 15.2 10.2C16.2 9.6 17.5 10.2 17.4 11.3C17.3 12.3 16 12.8 15.2 12.2"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "left center",
                  animation: "wing-flap 0.9s ease-in-out infinite",
                }}
              />
            </svg>
          )}
          {children}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
