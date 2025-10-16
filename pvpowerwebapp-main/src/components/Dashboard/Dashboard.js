import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthProvider.js";
import MultiStepFormProvider from "../../context/MultiStepFormProvider.js";
import "../../css/Dashboard/Dashboard.css";
import Login from "../Login/Login.js";
import Sidebar from "./Sidebar";

function Dashboard() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { user, handleIsLoggedIn } = useAuth();

  useEffect(() => {
    handleIsLoggedIn();
  }, [handleIsLoggedIn]);

  function handleResize() {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (windowWidth < 1050) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          fontSize: "28px",
          color: "black",
        }}
      >
        <p>Please view in bigger screen.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Login />
      </>
    );
  }

  return (
    <div className="container">
      <Sidebar />
      <MultiStepFormProvider>
        <Outlet />
      </MultiStepFormProvider>
    </div>
  );
}

export default Dashboard;
