import React, { useEffect, useState } from "react";
import { AiFillCrown, AiFillHome } from "react-icons/ai";
import { BsFillFileBarGraphFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdAdminPanelSettings, MdCompareArrows, MdOnlinePrediction, MdWorkHistory } from "react-icons/md";
import { RiMenuLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { getPaymentFlow } from "../../api/paymentFlow.js";
import { useAuth } from "../../context/AuthProvider.js";
import "../../css/Dashboard/Sidebar.css";

function Sidebar() {
  const { pathname } = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState(null);

  const { user, handleLogout } = useAuth();

  const handleToggle = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    async function getPaymentPlan() {
      const result = await getPaymentFlow(user._id);
      setPaymentPlan(result.data.userPayment);
    }
    getPaymentPlan();
  }, [user._id]);

  return (
    <div className={"sidebar__container"}>
      <div className="header">
        {!showMenu && <RiMenuLine className="menu_icon" onClick={handleToggle} />}
        {showMenu && <IoClose className="menu_icon" onClick={handleToggle} />}
        <h1 className="logo" style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "white", fontSize: "18px" }}>{!showMenu ? "DASHBOARD" : "MENU"}</span>
        </h1>
      </div>

      {!showMenu && (
        <div className={"sidebar-links"}>
          <Link
            className={`user-sideInfo ${pathname === "/dashboard/account" ? "account-open active-sb" : ""}`}
            to={`/dashboard/account`}
          >
            <FaUserCircle className="username-icon" />
            <p className={`user-account`}>Account</p>
          </Link>
          <Link className={`link-to-home ${pathname === `/dashboard/main` && "active-sb"}`} to={`/dashboard/main`}>
            <AiFillHome className="home-icon" />
            <span className={`link-text`}>Home</span>
          </Link>
          <Link
            className={`link-to-graph ${pathname === `/dashboard/visualise` && "active-sb"}`}
            to={`/dashboard/visualise`}
          >
            <BsFillFileBarGraphFill className="graph-icon" />
            <span className={`link-text`}>Visualize</span>
          </Link>
          <Link
            to={`/dashboard/forecast`}
            className={`link-to-forecast ${pathname === `/dashboard/forecast` && "active-sb"}`}
          >
            <MdOnlinePrediction className="forecast-icon" />
            <span className={`link-text`}>Forecast</span>
          </Link>
          <Link
            to={`/dashboard/validateData`}
            className={`link-to-compare ${pathname === `/dashboard/validateData` && "active-sb"}`}
          >
            <MdCompareArrows className="compare-icon" />
            <span className={`link-text`}>Validate</span>
          </Link>

          <Link
            to={`/dashboard/sample`}
            className={`link-to-sample ${pathname === `/dashboard/sample` && "active-sb"}`}
          >
            <FaDatabase className="sample-icon" />
            <span className={`link-text`}>Sample Data</span>
          </Link>

          {paymentPlan?.currentPlanId.plan_displayName !== "freePlan" ? (
            <Link
              to={`/dashboard/history`}
              className={`link-to-history ${pathname === `/dashboard/history` && "active-sb"}`}
            >
              <MdWorkHistory className="history-icon" />
              <span className={`link-text`}>History</span>
            </Link>
          ) : (
            <div className={`link-to-history disabled`}>
              <MdWorkHistory className="history-icon" />
              <span className={`link-text`}>
                History <AiFillCrown style={{ color: "yellow" }} />
              </span>
            </div>
          )}

          {user.role === "admin" && (
            <Link
              to={`/dashboard/admin`}
              className={`link-to-sample ${pathname === `/dashboard/admin` && "active-sb"}`}
            >
              <MdAdminPanelSettings className="sample-icon" />
              <span className={`link-text`}>Admin</span>
            </Link>
          )}

          <div className="link-to-logout" onClick={handleLogout}>
            <FiLogOut className="logout-icon" />
            <span className={`link-text`}>Log out</span>
          </div>
        </div>
      )}

      {showMenu && (
        <div className={"sidebar-links"}>
          <Link className={`link-to-home`} to={`/`}>
            <span className={`link-text`} style={{ paddingLeft: "20px" }}>
              Home
            </span>
          </Link>
          <Link className={`link-to-graph`} to={`/pricing`}>
            <span className={`link-text`} style={{ paddingLeft: "20px" }}>
              Pricing
            </span>
          </Link>
          <Link to={`/contact`} className={`link-to-forecast`}>
            <span className={`link-text`} style={{ paddingLeft: "20px" }}>
              Contact
            </span>
          </Link>
          <Link to={`/tut`} className={`link-to-compare`}>
            <span className={`link-text`} style={{ paddingLeft: "20px" }}>
              Tutorial
            </span>
          </Link>

          <Link to={`/about`} className={`link-to-sample`}>
            <span className={`link-text`} style={{ paddingLeft: "20px" }}>
              About
            </span>
          </Link>

          <Link to={`/regulations`} className={`link-to-history`}>
            <span className={`link-text`} style={{ paddingLeft: "20px" }}>
              Regulations
            </span>
          </Link>

          <div className="link-to-logout" onClick={handleLogout}>
            <FiLogOut className="logout-icon" />
            <span className={`link-text`}>Log out</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
