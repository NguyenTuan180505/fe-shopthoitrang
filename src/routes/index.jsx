import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/HomePage";
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
      // REVIEW LIST (PROTECTED)
      // /reviews/:productId
      // ============================
      {
        path: "reviews/:productId",
        element: (
          <UserRoute>
            <ReviewList />
          </UserRoute>
        ),
      },

      // ============================
      // WRITE REVIEW (PROTECTED)
      // /reviews/:productId/write
      // ============================
      {
        path: "reviews/:productId/write",
        element: (
          <UserRoute>
            <ReviewForm />
          </UserRoute>
        ),
      },

      // ============================
      // PROFILE
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
