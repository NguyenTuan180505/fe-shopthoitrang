import { createBrowserRouter } from "react-router-dom";

// ===== USER =====
import MainLayout from "../layouts/Mainlayout";
import HomePage from "../pages/user/Home/HomePage";
import ShopPage from "../pages/user/Shop/ShopPage";
import ProductDetailPage from "../pages/user/ProductDetail/ProductDetailPage";
import Profile from "../pages/user/Profile/Profile";
import OrderList from "../pages/user/Profile/OrderList";
import OrderDetail from "../pages/user/Profile/OrderDetail";
import Address from "../pages/user/Profile/Address";
import Login from "../pages/login/Login";
import VerifyOtp from "../pages/login/VerifyOtp";
import Signup from "../pages/Signup/Signup";
import Payment from "../pages/user/Payment/Payment";
import ReviewList from "../pages/user/Review/ReviewList";
import ReviewForm from "../pages/user/Review/ReviewForm";
import CartPage from "../pages/user/Cart/CartPage";
import FeaturesPage from "../pages/user/Features/FeaturesPage";
import ContactPage from "../pages/user/Contact/ContactPage";
import UserRoute from "./UserRoute";

// ===== ADMIN =====
import AdminLayout from "../layouts/AdminLayout";
// import AdminLogin from "../pages/admin/Login";

export const router = createBrowserRouter([
  // ============================
  // USER ROOT
  // ============================
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "cart", element: <CartPage /> },

      {
        path: "payment",
        element: (
          <UserRoute>
            <Payment />
          </UserRoute>
        ),
      },

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

      { path: "shop", element: <ShopPage /> },
      { path: "features", element: <FeaturesPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },

      {
        path: "profile",
        element: (
          <UserRoute>
            <Profile />
          </UserRoute>
        ),
        children: [
          { path: "addresses", element: <Address /> },
          {
            path: "orders",
            element: <OrderList />,
            children: [{ path: ":id", element: <OrderDetail /> }],
          },
        ],
      },

      { path: "login", element: <Login /> },
      { path: "verify-otp", element: <VerifyOtp /> },
    ],
  },

  // ============================
  // SIGNUP
  // ============================
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/admin/*",
    element: <AdminLayout />,
  },
]);
