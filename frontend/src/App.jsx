import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./pages/PrivateRoute.jsx"; // Import the PrivateRoute component
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Route */}
        <Route path="/" element={<PrivateRoute element={<Home />} />} />

        {/* Public Routes */}
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  );
}
