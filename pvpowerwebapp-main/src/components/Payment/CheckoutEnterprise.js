import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createOrderFlow, getApiKeysFlow, verifyPaymentFlow } from "../../api/paymentFlow";
import { useAuth } from "../../context/AuthProvider";

import "../../css/Pages/Payment/CheckoutEnterprise.css";

function CheckoutEnterprise() {
  const { user } = useAuth();

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function handleVerifyPayment(response) {
    const result = await verifyPaymentFlow(response);
    if (result.status === "success") {
      toast.success("Payment successful!");
    } else {
      toast.error("Payment failed!");
    }
  }

  async function handleBuyPlan() {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razropay failed to load!!");
      return;
    }

    const resultKeys = await getApiKeysFlow();
    if (resultKeys.status !== "success") {
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    const apiKey = resultKeys.keyId;

    const resultOrder = await createOrderFlow({ plan_id: "6670f734cde10fd3a951135e" });

    if (resultOrder.status !== "success") {
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    const orderId = resultOrder.orderId;
    const fetchedPlan = resultOrder.fetchedPlan;

    const options = {
      key: apiKey,
      amount: fetchedPlan.plan_price * 100,
      currency: "INR",
      name: "ML sol",
      description: fetchedPlan.plan_displayName,
      order_id: orderId,
      notes: {
        address: "TIH, IIT Roorkee",
      },
      theme: {
        color: "#3399cc",
      },
      handler: handleVerifyPayment,
    };

    const razorpayObject = new window.Razorpay(options);
    razorpayObject.open();
  }
  return (
    <div>
      <button
        className={user.email ? "checkout-btn" : "checkout-btn disabled-pay"}
        disabled={user.email ? false : true}
        onClick={handleBuyPlan}
      >
        Buy
      </button>
    </div>
  );
}

export default CheckoutEnterprise;
