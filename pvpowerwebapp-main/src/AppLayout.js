import { Outlet } from "react-router-dom";
import "./App.css";
import AuthProvider from "./context/AuthProvider";
import { Theme } from "@radix-ui/themes";

function AppLayout() {
  return (
    <Theme>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </Theme>
  );
}

export default AppLayout;
