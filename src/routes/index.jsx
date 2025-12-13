import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/Mainlayout";
import HomePage from "../pages/Home/HomePage";
import ShopPage from "../pages/Shop/ShopPage";
import ProductDetailPage from "../pages/ProductDetail/ProductDetailPage";
import Profile from "../pages/Profile/Profile";
import OrderList from "../pages/Profile/OrderList";
import OrderDetail from "../pages/Profile/OrderDetail";
import Address from "../pages/Profile/Address";
import Login from "../pages/Login/Login";
import VerifyOtp from "../pages/Login/VerifyOtp";
import Signup from "../pages/Signup/Signup";
import Payment from "../pages/Payment/Payment";
import ReviewList from "../pages/Review/ReviewList";
import ReviewForm from "../pages/Review/ReviewForm";
import UserRoute from "./UserRoute";
import CartPage from "../pages/Cart/CartPage";
import FeaturesPage from "../pages/Features/FeaturesPage";
import ContactPage from "../pages/Contact/ContactPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      // ============================
      // CART
      // ============================
      {
        path: "cart",
        element: <CartPage />,
      },

      // ============================
      // PAYMENT (PROTECTED)
      // ============================
      {
        path: "payment",
        element: (
          <UserRoute>
            <Payment />
          </UserRoute>
        ),
      },
      // ============================
      // REVIEW
      // ============================
      {
        path: "reviews/:productId",
        element: (
          <UserRoute>
            <ReviewList />
          </UserRoute>
        ),
      },
      {
        path: "reviews/:productId/write",
        element: (
          <UserRoute>
            <ReviewForm />
          </UserRoute>
        ),
      },

      // ============================
      // SHOP
      // ============================
      {
        path: "shop",
        element: <ShopPage />,
      },
      // ============================
      // OTHERS
      // ============================
      {
        path: "features",
        element: <FeaturesPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />,
      },

      // ============================
      // PROFILE (PROTECTED)
      // ============================
      {
        path: "profile",
        element: (
          <UserRoute>
            <Profile />
          </UserRoute>
        ),
        children: [
          {
            path: "addresses",
            element: <Address />,
          },
          {
            path: "orders",
            element: <OrderList />,
            children: [
              {
                path: ":id",
                element: <OrderDetail />,
              },
            ],
          },
        ],
      },

      {
        path: "login",
        element: <Login />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
    ],
  },

  {
    path: "/signup",
    element: <Signup />,
  },
]);
