import React from "react";
import "../css/Pages/Footer.css";
import { BsFacebook } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai";
import { GrLinkedin } from "react-icons/gr";
import { Link } from "react-router-dom";
import Wave from "react-wavify";
import styled from "@emotion/styled";
import MLsol from "../Images/Logos/mlsol_footer_logo.png";

const AppContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 60vh;
  margin-bottom: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const WaveContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${(props) => props.level + "vh"};
  display: flex;
  flex-direction: row;
`;

const TextContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;
`;

function Footer() {
  return (
    <AppContainer>
      <WaveContainer level={45}>
        <Wave
          fill="#121621"
          paused={false}
          opacity="0.30"
          options={{
            height: 20,
            amplitude: 10,
            speed: 0.2,
            points: 3,
          }}
        />
      </WaveContainer>
      <WaveContainer level={45}>
        <Wave
          fill="#121621"
          opacity="0.80"
          paused={false}
          options={{
            height: 75,
            amplitude: 20,
            speed: 0.3,
            points: 2,
          }}
        />
      </WaveContainer>
      <WaveContainer level={45}>
        <Wave
          fill="#121621"
          paused={false}
          opacity="0.5"
          options={{
            height: 45,
            amplitude: 30,
            speed: 0.1,
            points: 4,
          }}
        />
      </WaveContainer>
      <TextContainer>
        {/* Your text content goes here */}
        <div className="footer__container">
          {/* Use your SVG as the background */}

          <div className="footer__top ">
            <div className="footer__logo">
              <img src={MLsol} alt="Logo" style={{ width: "80%" }} />
            </div>
            <div className="footer__company">
              <p className="title" style={{ marginBottom: "5px", marginTop: "20px", color: "#fff" }}>
                COMPANY
              </p>
              <Link to={"/about"} className="footer-link about">
                About
              </Link>
              <Link to={"/faq"} className=" footer-link history">
                FAQ's
              </Link>
              {/* <br /> */}
              <a className="contact-link contact__email" href="mailto:admin@ml-sol.com">
                Email: admin@ml-sol.com
              </a>
              <a className="contact-link contact__phone" href="tel:1234567890">
                Phone: +91 1234567890
              </a>
            </div>
            <div className="footer__follow">
              <p className="title follow" style={{ marginBottom: "5px", marginTop: "15px", color: "#fff" }}>
                FOLLOW US
              </p>
              <div className="wrapper">
                <div className="icons facebook">
                  <span>
                    <BsFacebook className="facebookicon" />
                  </span>
                </div>

                <div className="icons instagram">
                  <span>
                    <AiFillInstagram className="instagram icon" />
                  </span>
                </div>

                <div className="icons linkdin">
                  <span>
                    <GrLinkedin className="linkedin icon" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="footer__copyright">&#169; COPYRIGHT 2023</p>
      </TextContainer>
    </AppContainer>
  );
}
export default Footer;
