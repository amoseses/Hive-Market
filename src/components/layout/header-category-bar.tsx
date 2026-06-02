import Link from "next/link";

import { Gift, Palette } from "lucide-react";

type CategoryItem = { id: string; name: string; slug: string };

type Props = {
  categories: CategoryItem[];
  isSeller?: boolean;
  isAdmin?: boolean;
};

export function HeaderCategoryBar({ categories, isSeller, isAdmin }: Props) {
  return (
    <nav
      aria-label="Categories"
      className="border-t border-white/10 bg-market-nav-secondary text-sm text-white"
    >
      <div className="container flex items-center gap-4 overflow-x-auto py-2.5 whitespace-nowrap">
        <Link href="/products" className="shrink-0 font-semibold hover:text-market-accent">
          All Products
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${encodeURIComponent(c.slug)}`}
            className="shrink-0 hover:text-market-accent"
          >
            {c.name}
          </Link>
        ))}
        <Link href="/products?q=gift" className="flex shrink-0 items-center gap-1 hover:text-market-accent">
          <Gift className="h-3.5 w-3.5" />
          Gift Finder
        </Link>
        <Link href="/products?q=artisan" className="flex shrink-0 items-center gap-1 hover:text-market-accent">
          <Palette className="h-3.5 w-3.5" />
          Artisan Goods
        </Link>
        <span className="mx-1 hidden h-4 w-px shrink-0 bg-white/20 sm:block" />
        <Link href="/feedback" className="shrink-0 hover:text-market-accent">
          Customer Service
        </Link>
        {isSeller ? (
          <Link href="/admin" className="shrink-0 text-market-accent hover:underline">
            Seller Console
          </Link>
        ) : (
          <Link href="/account/become-seller" className="shrink-0 hover:text-market-accent">
            Sell on Hive Markets
          </Link>
        )}
        {isAdmin ? (
          <Link href="/manager" className="shrink-0 text-market-accent hover:underline">
            Manager Console
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
