import { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import ProductTabs from "../../components/ProductTabs/ProductTabs";
import ExclusiveOffer from "../../components/Home/ExclusiveOffer";
import FeaturedCategories from "../../components/Home/FeaturedCategories";
export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7298/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi load sản phẩm:", err));
  }, []);

  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <div className="container">
        <ProductTabs products={products} />
      </div>
      <ExclusiveOffer />
    </>
  );
}
