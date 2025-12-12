import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/Mainlayout";
import HomePage from "../pages/Home/HomePage";
import ShopPage from "../pages/Shop/ShopPage";
import ProductDetailPage from "../pages/ProductDetail/ProductDetailPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "shop",
        element: <ShopPage />,
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />,
      },
    ],
  },
]);
