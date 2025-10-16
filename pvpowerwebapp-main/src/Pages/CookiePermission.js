import React, { useState } from "react";
import { useCookies } from "react-cookie";
import "../css/Pages/CookiePermission.css";
import { FaCookieBite } from "react-icons/fa";

function CookiePermission() {
  const [show, setShow] = useState(true);
  const [cookie, setCookie] = useCookies(["cookieConsent"]);
  const handleClick = () => {
    setCookie("cookieConsent", true, { path: "/" });
    setShow(false);
  };
  if (!show) {
    return null;
  }
  return (
    <div className="cookie_container">
      <div className="cookie_txt">
        <p style={{ color: "white" }}>
          We use cookies to enhance our site experience. Read 
          <span>Privacy Policy</span> and <span>Cookie Policy</span>.
        </p>
        <div className="cookie_btns">
          <button className="cookie_accept" onClick={handleClick}>
            Got it
          </button>
        </div>
      </div>
      <FaCookieBite style={{ color: "white" }} className="cookie_icon" />
    </div>
  );
}

export default CookiePermission;
