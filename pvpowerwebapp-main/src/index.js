import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import "@radix-ui/themes/styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../src/components/Login/Login";
import ResetPassword from "../src/components/Login/ResetPassword";
import Signup from "../src/components/Signup/Signup";
import About from "../src/Pages/About";
import Contact from "../src/Pages/Contact";
import Pricing from "../src/Pages/Pricing";
import App from "./App";
import AppLayout from "./AppLayout";
import Dashboard from "./components/Dashboard/Dashboard";
import Forecast from "./components/Dashboard/Forecast";
import GraphError from "./components/Dashboard/GraphError";
import History from "./components/Dashboard/History";
import Main from "./components/Dashboard/Main";
import SampleData from "./components/Dashboard/SampleData";
import UserAccount from "./components/Dashboard/UserAccount";
import Validate from "./components/Dashboard/Validate";
import Visualise from "./components/Dashboard/Visualise";
import PaymentDone from "./components/Payment/PaymentDone";
import PaymentFail from "./components/Payment/PaymentFail";
import { Error } from "./Pages/Error";
import Faq from "./Pages/FAQ/Faq";
import Hero from "./Pages/Hero";
import Regulations from "./Pages/Regulations/Regulations";
import Tutorial from "./Pages/Tutorial";
import VerifyEmail from "./Pages/VerifyEmail";
import VerifyPhone from "./Pages/VerifyPhone";
import AdminPanel from "./components/Admin/AdminPanel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <App />,
        errorElement: <Error />,
        children: [
          {
            path: "/",
            element: <Hero />,
          },
          {
            path: "/pricing",
            element: <Pricing />,
          },
          {
            path: "/about",
            element: <About />,
          },
          {
            path: "/contact",
            element: <Contact />,
          },
          {
            path: "/faq",
            element: <Faq />,
          },
          {
            path: "/tut",
            element: <Tutorial />,
          },
          {
            path: "/regulations",
            element: <Regulations />,
          },
        ],
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        errorElement: <Error />,
        children: [
          {
            path: "main",
            element: <Main />,
          },
          {
            path: "visualise",
            element: <Visualise />,
            errorElement: <GraphError />,
          },
          {
            path: "history",
            element: <History />,
          },
          {
            path: "account",
            element: <UserAccount />,
          },
          {
            path: "forecast",
            element: <Forecast />,
          },
          {
            path: "validateData",
            element: <Validate />,
          },
          {
            path: "sample",
            element: <SampleData />,
          },
          {
            path: "admin",
            element: <AdminPanel />,
          },
        ],
      },
      {
        path: "/signup",
        element: <Signup />,
        errorElement: <Error />,
      },
      {
        path: "/login",
        element: <Login />,
        errorElement: <Error />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
        errorElement: <Error />,
      },
      {
        path: "/verify-email/:email",
        element: <VerifyEmail />,
        errorElement: <Error />,
      },
      {
        path: "/verify-phone/:phone",
        element: <VerifyPhone />,
        errorElement: <Error />,
      },
      {
        path: "/payment_failed",
        element: <PaymentFail />,
      },
      {
        path: "/payment_success",
        element: <PaymentDone />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
