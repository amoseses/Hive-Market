import {
  HomeFeaturedProducts,
  HomeProductRows,
} from "@/components/home/home-sections";
import { getHomePageSections } from "@/lib/data/home-catalog";

export default async function HomePage() {
  const { featured, bestSellers, newArrivals, ratings } = await getHomePageSections();

  return (
    <div className="pb-6">
      <HomeFeaturedProducts featured={featured} ratings={ratings} />
      <HomeProductRows
        bestSellers={bestSellers}
        newArrivals={newArrivals}
        ratings={ratings}
      />
    </div>
  );
}
