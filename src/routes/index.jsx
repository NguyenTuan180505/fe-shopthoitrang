import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/Mainlayout";
import HomePage from "../pages/Home/HomePage";
import ShopPage from "../pages/Shop/ShopPage";
import ProductDetailPage from "../pages/ProductDetail/ProductDetailPage";
import Profile from "../pages/Profile/Profile";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import UserRoute from "./UserRoute";
import CartPage from "../pages/Cart/CartPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
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
      {
        path: "profile",
        element: (
          <UserRoute>
            <Profile />
          </UserRoute>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
    ],
  },
]);
