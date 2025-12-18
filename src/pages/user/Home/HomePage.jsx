import { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import ProductTabs from "../../../components/ProductTabs/ProductTabs";
import ExclusiveOffer from "../../../components/Home/ExclusiveOffer";
import FeaturedCategories from "../../../components/Home/FeaturedCategories";
import { getProductsWithRating } from "../../../services/productService";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsWithRating()
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
