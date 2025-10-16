import { Outlet } from "react-router-dom";
import "./App.css";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Pages/Footer";
import Navigation from "./Pages/Navigation";
import { useAuth } from "./context/AuthProvider";
import { useEffect } from "react";

function App() {
  const { handleIsLoggedIn } = useAuth();

  useEffect(() => {
    handleIsLoggedIn();
  }, [handleIsLoggedIn]);

  return (
    <div className="app__container">
      <Navigation />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
