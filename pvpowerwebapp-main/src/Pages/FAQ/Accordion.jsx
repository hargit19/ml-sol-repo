import React, { useState } from "react";
import "../../css/Pages/FAQ/Accordion.css";

const Accordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`accordion ${isOpen ? "open" : ""}`}>
      <div className="accordion-header" onClick={toggleAccordion}>
        <h3>{title}</h3>
        <span className="accordion-icon">+</span>
      </div>
      <div className="accordion-content">{content}</div>
    </div>
  );
};

export default Accordion;
