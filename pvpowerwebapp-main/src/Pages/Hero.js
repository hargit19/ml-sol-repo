import React from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.js";
import "../css/Pages/Hero.css";

// Components
import CookiePermission from "./CookiePermission";
import Location from "./Location";
import Offer from "./Offer";
import OurSetup from "./OurSetup";
import TrustedBy from "./TrustedBy";
import WhyUs from "./WhyUs";

function Hero() {
  const [cookie] = useCookies(["cookieConsent"]);
  const { user } = useAuth();
  
  return (
    <>
      {/* Removed any potential margin-top that might push into the navbar */}
      <div className="hero__container">
        {/* Background image instead of animations */}
        <div className="hero__background-image"></div>
        
        <div className="hero__content">
          <div className="hero__text-container">
            <h1 className="hero__headline">
              <span className="hero__headline-main">Power up your day</span>
              <span className="hero__headline-sub">with advanced solar forecasting</span>
            </h1>
            
            <p className="hero__description">
              Get real-time predictions for your solar power output with our cutting-edge PV power forecast technology.
              Maximize efficiency and never miss a beat with accurate and reliable forecasting.
            </p>
            
            <div className="hero__cta-container">
              {user ? (
                <Link to="/dashboard/main" className="hero__cta-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="hero__cta-primary">
                    Get Started
                  </Link>
                  <Link to="/pricing" className="hero__cta-secondary">
                    View Plans
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="hero__feature-badges">
            <div className="hero__badge">
              <div className="hero__badge-icon">⚡</div>
              <span className="hero__badge-text">Real-time Data</span>
            </div>
            <div className="hero__badge">
              <div className="hero__badge-icon">📊</div>
              <span className="hero__badge-text">Smart Analytics</span>
            </div>
            <div className="hero__badge">
              <div className="hero__badge-icon">🔄</div>
              <span className="hero__badge-text">24/7 Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keep all other components as they were */}
      <Location />
      <OurSetup />
      <Offer />
      <WhyUs />
      <TrustedBy />
      {!cookie.cookieConsent && <CookiePermission />}
    </>
  );
}

export default Hero;