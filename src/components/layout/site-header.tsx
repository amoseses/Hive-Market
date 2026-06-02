import Link from "next/link";

import { ShoppingCart } from "lucide-react";

import { HeaderCategoryBar } from "@/components/layout/header-category-bar";
import { HeaderProfileButton } from "@/components/layout/header-profile-button";
import { HeaderSearch } from "@/components/layout/header-search";
import { SiteHeaderShell } from "@/components/layout/site-header-shell";
import { SiteNavMenu } from "@/components/layout/site-nav-menu";
import { getCategories } from "@/lib/data/catalog";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types/database";

type ProfileRow = {
  full_name: string | null;
  email: string;
  role: UserRole;
};

export async function SiteHeader() {
  const supabase = await createClient();
  const [categories, auth] = await Promise.all([
    getCategories(),
    supabase.auth.getUser(),
  ]);

  const user = auth.data.user;
  let profile: ProfileRow | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email, role")
      .eq("id", user.id)
      .single();
    if (data) profile = data as ProfileRow;
  }

  const isSeller = profile?.role === "staff" || profile?.role === "admin";
  const cartHref = user ? "/cart" : "/login?next=/cart";

  return (
    <SiteHeaderShell>
      <div className="bg-market-nav text-white">
        <div className="container flex items-center gap-3 py-3 md:gap-4">
          <Link
            href={cartHref}
            aria-label="Cart"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <ShoppingCart className="h-6 w-6" />
          </Link>

          <Link
            href="/"
            className="hidden shrink-0 px-1 sm:block"
          >
            <span className="font-serif text-xl font-semibold leading-none tracking-tight md:text-2xl">
              Hive<span className="brand-mark">Markets</span>
            </span>
          </Link>

          <div className="min-w-0 flex-1">
            <HeaderSearch />
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10"
            >
              Home
            </Link>
            <HeaderProfileButton
              loggedIn={Boolean(user && profile)}
              email={profile?.email}
              displayName={profile?.full_name ?? undefined}
              role={profile?.role}
            />
            {isSeller ? (
              <Button
                asChild
                size="sm"
                className="hidden h-9 rounded-full bg-market-accent px-3 text-xs font-semibold text-white hover:bg-market-accent-hover lg:inline-flex"
              >
                <Link href="/admin">Seller Console</Link>
              </Button>
            ) : null}
            {profile?.role === "admin" ? (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="hidden h-9 rounded-full border-white/30 bg-transparent px-3 text-xs font-semibold text-white hover:bg-white/10 lg:inline-flex"
              >
                <Link href="/manager">Manager</Link>
              </Button>
            ) : null}
            <SiteNavMenu
              categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
              isSeller={isSeller}
            />
          </div>
        </div>
        <HeaderCategoryBar
          categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
          isSeller={isSeller}
          isAdmin={profile?.role === "admin"}
        />
      </div>
    </SiteHeaderShell>
  );
}
