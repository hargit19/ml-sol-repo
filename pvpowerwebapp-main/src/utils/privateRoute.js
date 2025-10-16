import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function PrivateRoute() {
  const user = useAuth();
  console.log("YOO");
  if (!user.token) return <Navigate to="/login" />;
  return <Outlet />;
}

export default PrivateRoute;
