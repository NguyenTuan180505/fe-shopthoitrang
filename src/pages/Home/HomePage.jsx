import { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import ProductTabs from "../../components/ProductTabs/ProductTabs";

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

      <div className="container">
        <ProductTabs products={products} />
      </div>
    </>
  );
}
