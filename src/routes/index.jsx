import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/Mainlayout.jsx";
import HomePage from "../pages/Home/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);
