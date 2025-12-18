import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index";
import { UserAuthProvider } from "./context/UserAuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function App() {
  return (
      <UserAuthProvider>
        <RouterProvider router={router} />
      </UserAuthProvider>
  );
}
