import React, { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../css/Dashboard/DropDownMenu.css";
function DropDownMenu() {
  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(!show);
  };
  return (
    <div className="dropdown-btn-container">
      <button className="dropdown-btn" onClick={handleShow}>
        Menu {!show ? <FaCaretDown className="caret down" /> : <FaCaretUp className="caret up" />}
      </button>
      {show && (
        <div className="dropdown-btn-card">
          <Link className="dropdown__item home" to={"/"}>
            Home
          </Link>

          <Link className="dropdown__item pricing" to={"/pricing"}>
            Pricing
          </Link>

          <Link className="dropdown__item support" to={"/contact"}>
            Contact
          </Link>
          <Link className="dropdown__item support" to={"/tut"}>
            Tutorial
          </Link>
          <Link className="dropdown__item support" to={"/about"}>
            About
          </Link>
          <Link className="dropdown__item support" to={"/regulations"}>
            Regulations
          </Link>
        </div>
      )}
    </div>
  );
}

export default DropDownMenu;
