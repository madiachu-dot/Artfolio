"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "My Portfolio" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-6 px-4">
        <Link
          href="/"
          className="flex items-center gap-0 font-heading text-3xl tracking-wide text-primary"
        >
          <svg
            viewBox="0 5 13 11"
            className="size-7 shrink-0 -mr-0.5"
            aria-hidden="true"
          >
            <title>Left wing</title>
            <path
              d="M12 12C11 8 7.5 6 4.5 6.5C1.5 7 0.5 10.5 2.5 12.5C4.2 14.2 7 14 8.5 12.8C9.5 12 9.8 10.8 8.8 10.2C7.8 9.6 6.5 10.2 6.6 11.3C6.7 12.3 8 12.8 8.8 12.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Artfolio
          <svg
            viewBox="11 5 13 11"
            className="size-7 shrink-0 -ml-0.5"
            aria-hidden="true"
          >
            <title>Right wing</title>
            <g transform="scale(-1,1) translate(-24,0)">
              <path
                d="M12 12C11 8 7.5 6 4.5 6.5C1.5 7 0.5 10.5 2.5 12.5C4.2 14.2 7 14 8.5 12.8C9.5 12 9.8 10.8 8.8 10.2C7.8 9.6 6.5 10.2 6.6 11.3C6.7 12.3 8 12.8 8.8 12.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </Link>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
