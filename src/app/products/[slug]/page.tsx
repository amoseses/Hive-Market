import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductAddToCart } from "@/components/product/product-add-to-cart";
import { ProductReviewForm } from "@/components/product/product-review-form";
import { StarRating } from "@/components/product/star-rating";
import { createClient } from "@/lib/supabase/server";
import {
  getProductBySlug,
  getRatingStatsForProducts,
  getReviewsForProduct,
} from "@/lib/data/catalog";
import { formatMoney } from "@/lib/format";
import { isUnsplashUrl, resolveProductImageSrc } from "@/lib/product-photo";
import { publicStorageUrl } from "@/lib/storage";
import type { ProductImage, Review } from "@/types/database";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description?.slice(0, 155) ?? `Buy ${product.name} on Hive Markets.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, supabase] = await Promise.all([
    getReviewsForProduct(product.id),
    createClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const statsMap = await getRatingStatsForProducts([product.id]);
  const stats = statsMap.get(product.id);
  const avg = stats?.avg_rating != null ? Number.parseFloat(String(stats.avg_rating)) : null;
  const reviewCount = stats?.review_count ?? 0;

  const images = [...product.images].sort((a, b) => a.sort_order - b.sort_order) as ProductImage[];
  const mainSrc = resolveProductImageSrc(product.id, images);
  const usingFallback = images.length === 0;

  return (
    <PageShell wide>
      <Breadcrumbs>
        <Link href="/" className="market-link">
          Home
        </Link>
        <span className="mx-1.5">›</span>
        <Link href="/products" className="market-link">
          All Products
        </Link>
        {product.category ? (
          <>
            <span className="mx-1.5">›</span>
            <Link
              href={`/products?category=${encodeURIComponent(product.category.slug)}`}
              className="market-link"
            >
              {product.category.name}
            </Link>
          </>
        ) : null}
      </Breadcrumbs>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="market-section">
            <div className="relative aspect-square max-h-[520px] w-full bg-white">
              <Image
                src={mainSrc}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                unoptimized={isUnsplashUrl(mainSrc)}
              />
            </div>
            {!usingFallback && images.length > 1 ? (
              <div className="mt-4 flex gap-2 overflow-x-auto border-t pt-4">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border bg-white"
                  >
                    <Image
                      src={publicStorageUrl(img.storage_path)}
                      alt=""
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="market-section lg:hidden">
            <ProductInfo
              product={product}
              avg={avg}
              reviewCount={reviewCount}
              user={user}
              slug={slug}
            />
          </div>

          <Tabs defaultValue="description" className="market-section">
            <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Product details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Customer reviews ({reviewCount})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              {product.description ? (
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{product.description}</div>
              ) : (
                <p className="text-muted-foreground text-sm">No detailed description yet.</p>
              )}
            </TabsContent>
            <TabsContent value="reviews" className="mt-4 space-y-6">
              {user ? (
                <ProductReviewForm productId={product.id} productSlug={product.slug} />
              ) : (
                <p className="text-muted-foreground text-sm">
                  <Link href="/login" className="market-link font-medium">
                    Sign in
                  </Link>{" "}
                  to leave a review.
                </p>
              )}
              <div className="space-y-6">
                {(reviews as Review[]).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No reviews yet — be the first.</p>
                ) : (
                  (reviews as Review[]).map((r) => (
                    <article key={r.id} className="border-b pb-6 last:border-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <StarRating value={r.rating} size={14} />
                        <span className="text-sm font-medium">{r.author_display_name}</span>
                        {r.verified_purchase ? (
                          <Badge variant="outline" className="text-xs font-normal">
                            Verified purchase
                          </Badge>
                        ) : null}
                        <span className="text-muted-foreground text-xs">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {r.title ? <h3 className="mt-2 font-medium">{r.title}</h3> : null}
                      {r.body ? <p className="text-muted-foreground mt-1 text-sm">{r.body}</p> : null}
                    </article>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="hidden lg:block">
          <div className="market-section sticky top-36">
            <ProductInfo
              product={product}
              avg={avg}
              reviewCount={reviewCount}
              user={user}
              slug={slug}
            />
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function ProductInfo({
  product,
  avg,
  reviewCount,
  user,
  slug,
}: {
  product: Awaited<ReturnType<typeof getProductBySlug>> & object;
  avg: number | null;
  reviewCount: number;
  user: { id: string } | null;
  slug: string;
}) {
  if (!product) return null;

  return (
    <>
      <h1 className="text-2xl leading-snug font-normal text-market-nav">{product.name}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {reviewCount > 0 && avg != null ? (
          <>
            <StarRating value={avg} count={reviewCount} />
            <Link href="#reviews" className="market-link text-sm">
              {reviewCount} ratings
            </Link>
          </>
        ) : (
          <span className="text-muted-foreground text-sm">No customer ratings yet</span>
        )}
      </div>

      <Separator className="my-4" />

      <div className="flex flex-wrap items-start gap-2">
        <Badge variant="secondary" className="rounded-sm font-normal">
          SKU {product.sku}
        </Badge>
        {product.stock < product.min_order_qty ? (
          <Badge variant="destructive" className="rounded-sm font-normal">
            Low stock
          </Badge>
        ) : (
          <Badge className="rounded-sm bg-market-nav-secondary font-normal text-white">In stock</Badge>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground">Wholesale price</p>
        <p className="price-deal text-3xl tabular-nums">{formatMoney(product.price_cents)}</p>
        <p className="text-muted-foreground mt-1 text-xs">Per unit · excl. shipping &amp; tax</p>
        <p className="mt-2 text-sm">
          Minimum order: <span className="font-semibold">{product.min_order_qty} units</span>
        </p>
      </div>

      <Separator className="my-4" />

      {user ? (
        <ProductAddToCart
          productId={product.id}
          minOrderQty={product.min_order_qty}
          stock={product.stock}
        />
      ) : (
        <div className="space-y-2">
          <Button
            asChild
            className="h-10 w-full rounded-sm bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Link href={`/login?next=/products/${encodeURIComponent(slug)}`}>Sign in to buy</Link>
          </Button>
          <Button asChild variant="outline" className="h-10 w-full rounded-sm">
            <Link href={`/signup?next=/products/${encodeURIComponent(slug)}`}>Create account</Link>
          </Button>
        </div>
      )}

      <div className="mt-4 space-y-1 text-xs text-muted-foreground">
        <p>✓ Secure B2B checkout</p>
        <p>✓ Seller-verified listings</p>
        <p>✓ MOQ enforced at cart</p>
      </div>
    </>
  );
}
