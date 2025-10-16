import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.js";
import Checkout from "../components/Payment/Checkout.js";
import CheckoutEnterprise from "../components/Payment/CheckoutEnterprise";
import "../css/Pages/Pricing.css";

function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("monthly");

  const handleBillingToggle = (cycle) => {
    setBillingCycle(cycle);
  };

  return (
    <div className="pricing-page">
      <section id="pricing-container-new">
        <div className="pricing-header">
          <h1>We've got a plan</h1>
          <h2>that's perfect for you</h2>
          
          {/* <div className="billing-toggle">
            <button 
              className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => handleBillingToggle('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`toggle-btn ${billingCycle === 'annual' ? 'active' : ''}`}
              onClick={() => handleBillingToggle('annual')}
            >
              Annual
              <span className="discount-badge">-30%</span>
            </button>
          </div> */}
        </div>

        <div className="pricing-cards-container">
          {/* Free Plan */}
          <div className="pricing-card">
            <div className="card-header">
              <h3>Basic</h3>
            </div>

            <div className="card-price">
              <div className="price-amount">
                <span className="currency">Rs.</span>
                <span className="price">0</span>
              </div>
              <div className="price-period">3 Days Free Trial</div>
            </div>

            {user ? (
              <button className="cta-button" onClick={() => navigate("/dashboard/main")}>
              Begin with Free trial
            </button>
            ) : (
              <button className="cta-button" onClick={() => navigate("/login")}>
                Login to Purchase
              </button>
            )}

            

            <ul className="features-list">
              <li className="feature-item">
                <FaCheck className="check-icon" />
                <span>3 Days Free Plan</span>
              </li>
              <li className="feature-item">
                <FaCheck className="check-icon" />
                <span>Quick And Detailed Forecast</span>
              </li>
              <li className="feature-item">
                <FaCheck className="check-icon" />
                <span>2 Model Runs per day</span>
              </li>
              <li className="feature-item">
                <RxCross2 className="cross-icon" />
                <span>History Tab</span>
              </li>
              <li className="feature-item">
                <RxCross2 className="cross-icon" />
                <span>Tech support</span>
              </li>
            </ul>
          </div>

          {/* Professional Plan */}
          <div className="pricing-card professional">
            <div className="popular-tag">Popular!</div>
            
            <div className="card-header">
              <h3>Extended Testing</h3>
            </div>
            <div className="card-price">
              <div className="price-amount">
                <span className="currency"> Rs.</span>
                <span className="price">5000</span>
              </div>
              <div className="price-period">/15 days</div>
            </div>

            {user ? (
              <Checkout />
            ) : (
              <button className="cta-button" onClick={() => navigate("/login")}>
                Login to Purchase
              </button>
            )}

            <ul className="features-list">
              <li className="feature-item">
                <FaCheck className="check-icon" />
                <span>1 Month Plan</span>
              </li>
              <li className="feature-item">
                <FaCheck className="check-icon" />
                <span>Quick And Detailed Forecast</span>
              </li>
              <li className="feature-item">
                <FaCheck className="check-icon" />
                <span>5 Model Runs per day</span>
              </li>
              <li className="feature-item">
                <FaCheck className="check-icon" />
                <span>History Tab</span>
              </li>
              <li className="feature-item">
                <RxCross2 className="cross-icon" />
                <span>Tech support</span>
              </li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="pricing-card">
            <div className="card-header">
              <h3>Enterprise</h3>
            </div>

            <div className="card-price">
              <div>Contact support/admin at mlsol.iit@gmail.com or admin@ml-sol.com for details</div>
            </div>

            {/* {user ? (
              <CheckoutEnterprise user={user} />
            ) : (
              <button className="cta-button" onClick={() => navigate("/login")}>
                Login to purchase
              </button>
            )} */}

            <ul className="features-list">
              <li className="feature-item">
                <FaCheck className="check-icon" />
                <span>6 Months Plan</span>
              </li>
              <li className="feature-item">
                <FaCheck className="check-icon" />
                <span>Quick And Detailed Forecast</span>
              </li>
              <li className="feature-item">
                <FaCheck className="check-icon" />
                <span>7 Model Runs per day</span>
              </li>
              <li className="feature-item">
                <FaCheck className="check-icon" />
                <span>History Tab</span>
              </li>
              <li className="feature-item">
                <FaCheck className="check-icon" />
                <span>Tech support</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <div style={{width: "80%", marginInline: "10%" , backgroundColor: "gray" , borderRadius: "10px", padding : "10px" , color : "black" , fontWeight : "500" , marginBottom: "60px" }}><span style={{ fontWeight : "600" }}>Note:</span> <br></br> The Number of model runs per day are limited. Do use them carefully. Submission of wrong input file or data may result in the loss of a model run. Once the runs are completed for the day, you would not be able to run the model throughout the day.</div>
    </div>
  );
}

export default Pricing;