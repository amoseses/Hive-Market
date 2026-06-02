"use client";

import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CategoryItem = { id: string; name: string; slug: string };

type Props = {
  categories: CategoryItem[];
  isSeller?: boolean;
};

export function SiteNavMenu({ categories, isSeller }: Props) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
      >
        <Menu className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl">
        <DropdownMenuLabel className="font-serif text-base">Browse</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/products")}>All Products</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/products?q=gift")}>Gift Finder</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/products?q=artisan")}>
          Artisan Goods
        </DropdownMenuItem>
        {categories.length > 0 ? <DropdownMenuSeparator /> : null}
        {categories.map((c) => (
          <DropdownMenuItem
            key={c.id}
            onClick={() => router.push(`/products?category=${encodeURIComponent(c.slug)}`)}
          >
            {c.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/feedback")}>Customer Service</DropdownMenuItem>
        {isSeller ? (
          <DropdownMenuItem onClick={() => router.push("/admin")}>Seller Console</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => router.push("/account/become-seller")}>
            Sell on Hive Markets
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
