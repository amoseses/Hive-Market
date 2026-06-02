import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { searchParams: Promise<{ welcome?: string }> };

export default async function AdminHomePage({ searchParams }: Props) {
  const sp = await searchParams;

  return (
    <div className="space-y-8">
      {sp.welcome === "seller" ? (
        <div className="border-primary/30 bg-primary/5 rounded-lg border px-4 py-3 text-sm">
          Welcome to the seller console. Start by{" "}
          <Link href="/admin/products/new" className="text-primary font-medium underline">
            adding your first product
          </Link>
          .
        </div>
      ) : null}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Seller console</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage catalog listings and review buyer orders.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Products</CardTitle>
            <CardDescription>Publish SKUs, pricing, and MOQs.</CardDescription>
            <Button asChild variant="outline" className="mt-4 w-fit">
              <Link href="/admin/products">Open</Link>
            </Button>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shipping & payouts</CardTitle>
            <CardDescription>Ship-from address and Stripe Connect for checkout.</CardDescription>
            <Button asChild variant="outline" className="mt-4 w-fit">
              <Link href="/admin/shipping">Open</Link>
            </Button>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders</CardTitle>
            <CardDescription>Update fulfillment status.</CardDescription>
            <Button asChild variant="outline" className="mt-4 w-fit">
              <Link href="/admin/orders">Open</Link>
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
