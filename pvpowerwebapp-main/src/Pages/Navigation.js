import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MLsol from "../Images/Logos/mlsol_navbar_logo.png";
import { useAuth } from "../context/AuthProvider.js";
import "../css/Pages/Navigation.css";

function Navigation() {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  function handleToggle() {
    document.getElementsByClassName("nav__list")[0].classList.toggle("active");
  }

  // Define the scroll event handler
  function handleScroll() {
    const navbar = document.querySelector(".nav__container");
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="nav__container">
        <div className="nav__logo">
          <img src={MLsol} alt="logo" style={{ marginBottom: "8px" }} />

          <div className="nav__toggle" onClick={handleToggle}>
            <span className="toggle"></span>
            <span className="toggle"></span>
            <span className="toggle"></span>
          </div>
        </div>

        <div className="nav__list">
          <Link className="nav__item home" to={"/"}>
            Home
          </Link>

          <Link className="nav__item pricing" to={"/pricing"}>
            Pricing
          </Link>

          <Link className="nav__item support" to={"/contact"}>
            Contact
          </Link>
          <Link className="nav__item support" to={"/tut"}>
            Tutorial
          </Link>
          <Link className="nav__item support" to={"/about"}>
            About
          </Link>
          <Link className="nav__item support" to={"/regulations"}>
            Regulations
          </Link>
          {user ? (
            <button style={{ border: "none" }} className="nav__item dashboard__btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button style={{ border: "none" }} className="nav__item dashboard__btn" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Navigation;
