import Link from "next/link";

import { Breadcrumbs, PageShell } from "@/components/layout/page-shell";
import { ProductGrid } from "@/components/product/product-grid";
import { getCategories, getPublishedProducts, getRatingStatsForProducts } from "@/lib/data/catalog";
import { sortProductsByBestSellers } from "@/lib/data/home-catalog";
import { Button } from "@/components/ui/button";

type Props = {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const categorySlug = sp.category?.trim() || undefined;
  const q = sp.q?.trim() || undefined;

  const [categories, products] = await Promise.all([
    getCategories(),
    getPublishedProducts({ categorySlug, q }),
  ]);

  const list = [...products];

  const ratingsMap = await getRatingStatsForProducts(list.map((p) => p.id));
  const ratings = Object.fromEntries(ratingsMap);

  if (sp.sort === "price_asc") list.sort((a, b) => a.price_cents - b.price_cents);
  else if (sp.sort === "price_desc") list.sort((a, b) => b.price_cents - a.price_cents);
  else if (sp.sort === "popular") {
    const sorted = await sortProductsByBestSellers(list, ratingsMap);
    list.splice(0, list.length, ...sorted);
  } else {
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <PageShell wide>
      <Breadcrumbs>
        <Link href="/" className="market-link">
          Home
        </Link>
        <span className="mx-1.5">›</span>
        <span className="text-foreground">All Products</span>
        {activeCategory ? (
          <>
            <span className="mx-1.5">›</span>
            <span className="text-foreground">{activeCategory.name}</span>
          </>
        ) : null}
      </Breadcrumbs>

      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="market-section sticky top-36 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-market-nav">Department</h2>
              <ul className="mt-2 space-y-1 text-sm">
                <li>
                  <Link
                    href="/products"
                    className={cnLink(!categorySlug)}
                  >
                    All categories
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/products?category=${encodeURIComponent(c.slug)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                      className={cnLink(categorySlug === c.slug)}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <div>
          <div className="market-section mb-4">
            <form method="get" className="flex flex-col gap-3 sm:flex-row sm:items-end">
              {q ? <input type="hidden" name="q" value={q} /> : null}
              <div className="grid gap-1.5 sm:w-44">
                <label className="text-xs font-bold text-market-nav" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={categorySlug ?? ""}
                  className="border-input bg-background h-10 w-full rounded-sm border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">All</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5 md:w-44">
                <label className="text-xs font-bold text-market-nav" htmlFor="sort">
                  Sort by
                </label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={sp.sort ?? "newest"}
                  className="border-input bg-background h-10 w-full rounded-sm border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Best Sellers</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
              <Button type="submit" className="h-10 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90">
                Go
              </Button>
            </form>
          </div>

          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <p>
              <span className="font-semibold text-market-nav">{list.length} results</span>
              {q ? (
                <span className="text-muted-foreground">
                  {" "}
                  for &ldquo;{q}&rdquo;
                </span>
              ) : null}
            </p>
          </div>

          <div className="market-section">
            {list.length > 0 ? (
              <ProductGrid products={list} ratings={ratings} compact />
            ) : (
              <p className="text-muted-foreground py-8 text-center text-sm">
                No products match your filters.{" "}
                <Link href="/products" className="market-link">
                  Clear filters
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function cnLink(active: boolean) {
  return active
    ? "font-semibold text-primary"
    : "text-foreground hover:text-brand-sky hover:underline";
}
