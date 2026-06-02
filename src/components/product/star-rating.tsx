import { Star } from "lucide-react";

export function StarRating({
  value,
  count,
  size = 16,
}: {
  value: number;
  count?: number;
  size?: number;
}) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className="flex flex-wrap items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(Math.max(rounded - i, 0), 1);
        return (
          <Star
            key={i}
            width={size}
            height={size}
            className={
              fill >= 1
                ? "fill-brand-sky text-brand-sky"
                : fill > 0
                  ? "fill-brand-sky/50 text-brand-sky"
                  : "fill-transparent text-neutral-300"
            }
          />
        );
      })}
      {count != null ? (
        <span className="market-link ml-1 text-xs">{count.toLocaleString()}</span>
      ) : null}
    </div>
  );
}
