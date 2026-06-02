import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-market-nav-secondary text-white">
      <div className="container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif font-semibold">Get to Know Us</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-300">
            <li>
              <Link href="/feedback" className="hover:underline">
                About Hive Markets
              </Link>
            </li>
            <li>
              <Link href="/account/become-seller" className="hover:underline">
                Sell on Hive Markets
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-serif font-semibold">Discover</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-300">
            <li>
              <Link href="/products?q=gift" className="hover:underline">
                Gift Finder
              </Link>
            </li>
            <li>
              <Link href="/products?q=artisan" className="hover:underline">
                Artisan Goods
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-serif font-semibold">Customer Service</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-300">
            <li>
              <Link href="/orders" className="hover:underline">
                Your orders
              </Link>
            </li>
            <li>
              <Link href="/feedback" className="hover:underline">
                Contact us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-serif font-semibold">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-300">
            <li>
              <Link href="/products" className="hover:underline">
                All products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:underline">
                Cart
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-market-nav py-6">
        <div className="container flex flex-col items-center gap-2 text-center text-sm text-neutral-300">
          <p className="font-serif text-lg font-semibold text-white">
            Hive<span className="brand-mark">Markets</span>
          </p>
          <p>© {new Date().getFullYear()} Hive Markets. B2B wholesale marketplace.</p>
        </div>
      </div>
    </footer>
  );
}
