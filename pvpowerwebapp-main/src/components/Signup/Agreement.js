import React from "react";
import "../../css/Signup/Agreement.css";
import ReactDom from "react-dom";

function Agreement({ open, closeModal }) {
  if (!open) return null;
  return ReactDom.createPortal(
    <>
      <div className="agreement_wrapper" onClick={closeModal}></div>
      <div className="agreement_container">
        <h2>TERMS AND CONDITIONS</h2> <h3>Welcome to our website.</h3>
        <p>
          These terms and conditions govern your use of this website; by using this website, you accept these terms and
          conditions in full. If you disagree with these terms and conditions or any part of these terms and conditions,
          you must not use this website.{" "}
        </p>
        <p>Introduction</p>
        <ul>
          <li>1.1 These terms and conditions shall govern your use of our website.</li>
          <li>
            {" "}
            1.2 By using our website, you accept these terms and conditions in full; accordingly, if you disagree with
            these terms and conditions or any part of these terms and conditions, you must not use our website.
          </li>
          <li>
            {" "}
            1.3 If you register with our website or use any of our website services, we will ask you to expressly agree
            to these terms and conditions.
          </li>
          <li>
            {" "}
            1.4 Our website uses cookies; by using our website or agreeing to these terms and conditions, you consent to
            our use of cookies in accordance with the terms of our privacy policy.
          </li>
        </ul>
        <p> License to Use Website </p>
        <ul>
          <li>2.1 You may:</li>
          <ul>
            <li> View pages from our website in a web browser</li>
            <li> Download pages from our website for caching in a web browser</li>
            <li> Print pages from our website</li>
            <li> Stream audio and video files from our website</li>
            <li> Use our website services by means of a web browser.</li>
          </ul>
          <li>
            {" "}
            2.2 Except as expressly permitted by these terms and conditions, you must not edit or otherwise modify any
            material on our website.{" "}
          </li>
        </ul>
        <p>Acceptable Use </p>
        <ul>
          <li>3.1 You must not: </li>
          <ul>
            <li>
              Use our website in any way or take any action that causes, or may cause, damage to the website or
              impairment of the performance, availability, or accessibility of the website
            </li>
            <li>
              {" "}
              Use our website in any way that is unlawful, illegal, fraudulent, or harmful, or in connection with any
              unlawful, illegal, fraudulent, or harmful purpose or activity
            </li>
            <li>
              {" "}
              Use our website to copy, store, host, transmit, send, use, publish, or distribute any material that
              consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit,
              or other malicious computer software
            </li>
            <li>
              {" "}
              Conduct any systematic or automated data collection activities (including without limitation scraping,
              data mining, data extraction, and data harvesting) on or in relation to our website without our express
              written consent
            </li>
            <li> Access or otherwise interact with our website using any robot, spider, or other automated means</li>
            <li>
              {" "}
              Use data collected from our website for any direct marketing activity (including without limitation email
              marketing, SMS marketing, telemarketing, and direct mailing).
            </li>
          </ul>
        </ul>
        <p>Intellectual Property Rights</p>
        <ul>
          <li>
            4.1 Unless otherwise stated, we or our licensors own the intellectual property rights in the website and
            material on the website. Subject to the license below, all these intellectual property rights are reserved.{" "}
          </li>
          <li>
            4.2 You may view, download for caching purposes only, and print pages from the website for your own personal
            use, subject to the restrictions set out below and elsewhere in these terms and conditions.
          </li>
        </ul>
        <button onClick={closeModal} className="signup__btn" style={{ marginTop: "50px" }}>
          Accept
        </button>
      </div>
    </>,
    document.getElementById("agreement")
  );
}

export default Agreement;
