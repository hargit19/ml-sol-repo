import React from "react";
import Accordion from "./Accordion";
import "../../css/Pages/FAQ/Faq.css";

function Faq() {
  return (
    <div className="faq__container">
      <p className="title">FAQ's</p>
      <h1 className="faq__heading">Frequently Asked Questions</h1>
      <p className="extra">Have questions? We are here to help.</p>
      <div className="faq__accordion">
        <Accordion
          title={"Is there a free trial available?"}
          content={"Yes you can try our forecasting services for free with some limited Models for a particular time"}
        />
        <Accordion title={"Can i change my plan later?"} content={"Yes, you can change your plan later."} />
        <Accordion
          title={"How do i change my email?"}
          content={"Due to security reasons, you can only change your email by contacting our team on Contact tab."}
        />
      </div>
    </div>
  );
}

export default Faq;
