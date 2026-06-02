import Image from "next/image";
import Link from "next/link";

import { formatMoney } from "@/lib/format";
import { isUnsplashUrl, resolveProductImageSrc } from "@/lib/product-photo";
import type { Product, ProductImage } from "@/types/database";

import { StarRating } from "./star-rating";

type Props = {
  product: Product;
  images: ProductImage[];
  avgRating?: number | null;
  reviewCount?: number;
  compact?: boolean;
  featured?: boolean;
};

export function ProductCard({
  product,
  images,
  avgRating,
  reviewCount,
  compact = false,
  featured = false,
}: Props) {
  const src = resolveProductImageSrc(product.id, images);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-white p-2 transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div
        className={
          featured
            ? "relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-100"
            : compact
              ? "relative aspect-square w-full overflow-hidden rounded-xl bg-stone-100"
              : "relative aspect-square w-full overflow-hidden rounded-xl bg-stone-100"
        }
      >
        <Image
          src={src}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={
            featured
              ? "(max-width: 640px) 50vw, 25vw"
              : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          }
          unoptimized={isUnsplashUrl(src)}
        />
      </div>

      <div className="mt-2 flex flex-1 flex-col gap-1 px-0.5">
        <p className="font-serif line-clamp-2 text-left text-sm leading-snug text-foreground group-hover:text-primary">
          {product.name}
        </p>

        {avgRating != null && reviewCount != null && reviewCount > 0 ? (
          <StarRating value={avgRating} count={reviewCount} size={compact ? 12 : 14} />
        ) : (
          <span className="text-muted-foreground text-xs">No ratings yet</span>
        )}

        <div className="mt-auto pt-1">
          <p className="price-deal text-left text-lg font-normal tabular-nums">
            {formatMoney(product.price_cents)}
          </p>
          <p className="text-muted-foreground text-left text-xs">
            Min. order: {product.min_order_qty} units
          </p>
        </div>
      </div>
    </Link>
  );
}
