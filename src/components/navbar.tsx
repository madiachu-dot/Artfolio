import Link from "next/link";
import { NavLinks } from "~/components/nav-links";
import { Button } from "~/components/ui/button";
import { signOut } from "~/lib/supabase/actions";
import { createClient } from "~/lib/supabase/server";

const links = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/daily-challenges", label: "Prompts" },
  { href: "/portfolio", label: "My Portfolio" },
];

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b border-border bg-background">
      <div className="flex h-14 items-center gap-3 px-4 sm:gap-6 md:pl-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-0 font-heading text-2xl tracking-wide text-primary sm:text-3xl"
        >
          <svg
            viewBox="0 5 13 11"
            className="size-6 shrink-0 -mr-0.5 sm:size-7"
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
        <NavLinks links={links} />
        <div className="ml-auto">
          {user ? (
            <form action={signOut}>
              <Button type="submit" size="sm" variant="ghost">
                Sign out
              </Button>
            </form>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
