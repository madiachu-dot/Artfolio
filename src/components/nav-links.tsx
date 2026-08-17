"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

export function NavLinks({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className="flex gap-3 sm:gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm whitespace-nowrap transition-colors hover:text-foreground",
            pathname === link.href
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
