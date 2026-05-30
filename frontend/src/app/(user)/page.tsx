import CategoryNav from "@/components/user/CategoryNav";
import HeroSlider from "@/components/user/HeroSlider";
import DeliveryPromise from "@/components/user/DeliveryPromise";
import FlashSale from "@/components/user/FlashSale";
import FeaturedProducts from "@/components/user/FeaturedProducts";
import PromoBanners from "@/components/user/PromoBanners";
import FeaturedStores from "@/components/user/FeaturedStores";
import Newsletter from "@/components/user/Newsletter";

export default function HomePage() {
  return (
    <>
      <CategoryNav />
      <HeroSlider />
      <DeliveryPromise />
      <FlashSale />
      <FeaturedProducts />
      <PromoBanners />
      <FeaturedStores />
      <Newsletter />
    </>
  );
}
