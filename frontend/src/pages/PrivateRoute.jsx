import { Navigate, useLocation } from "react-router-dom";

// This function checks if the user is authenticated (e.g., check for a token in localStorage)
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token !== null; // If a token is present, user is authenticated
};

// PrivateRoute component that wraps protected routes
const PrivateRoute = ({ element, ...rest }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;
