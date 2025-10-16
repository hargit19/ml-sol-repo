import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import FOR from "../../Docs/FOR.pdf";
import CERC from "../../Docs/SOR7.pdf";
import "../../css/Pages/Regulations/Regulations.css";
import Calculator from "./Calculator";

function Regulations() {
  const openPDF = (str) => {
    switch (str) {
      case "cerc":
        window.open(CERC, "_blank");
        break;

      case "for":
        window.open(FOR, "_blank");
        break;

      case "mp":
        window.open("https://mperc.in/index.htm", "_blank");
        break;

      case "rj":
        window.open("https://rerc.rajasthan.gov.in/", "_blank");
        break;

      case "tn":
        window.open(
          "https://windpro.org/windproarticles/Forecasting%20and%20scheduling%20of%20renewable%20energy%20in%20Tamil%20Nadu-converted.pdf",
          "_blank"
        );
        break;

      case "mh":
        window.open(
          "https://mahasldc.in/wp-content/uploads/2018/12/Procedure%20F%20%26%20S%20MERC%20approved-35MB%20(1).pdf",
          "_blank"
        );
        break;

      case "kntk":
        window.open("https://kerc.karnataka.gov.in/uploads/22411664528139.pdf", "_blank");
        break;

      case "gj":
        window.open(
          "https://gercin.org/regulation/gerc-forecasting-scheduling-deviation-settlement-and-related-matters-of-solar-and-wind-generation-sources-regulations-2019/",
          "_blank"
        );
        break;
      
      case "ap":
        // Add appropriate URL for Andhra Pradesh
        window.open("https://example.com/andhra-pradesh-regulations", "_blank");
        break;
        
      default:
        break;
    }
  };
  
  return (
    <div className="regulations__container">
      <div className="regulations__header">
        <h1>Regulations</h1>
        <p className="regulations__intro">
          Welcome to our website! At PVcast, we understand the importance of accurate forecasting, regulatory compliance,
          and efficient scheduling. Our team is dedicated to leveraging cutting-edge technology and data analysis to
          forecast future trends and events, helping you make informed decisions and stay ahead of the competition. We
          also prioritize compliance with relevant regulations to ensure your operations run smoothly and within legal
          boundaries. With our expertise in scheduling, we can assist you in optimizing your resources, managing
          timelines, and maximizing productivity. Trust us to provide reliable forecasting, adhere to regulations, and
          streamline your scheduling processes for a successful and efficient future.
        </p>
      </div>

      <div className="regulations__content">
        <Tabs className="regulations__tabs">
          <TabList>
            <Tab>Regulations</Tab>
            <Tab>Calculator</Tab>
          </TabList>

          <TabPanel>
            <div className="docs-links">
              <div className="docs-section">
                <h3>Important Docs and Links</h3>
                <ul className="docs-list">
                  <li>
                    <div className="pdf-link" onClick={() => openPDF("cerc")}>
                      <span className="pdf-icon">📄</span>
                      <span className="pdf-text">CERC</span>
                    </div>
                  </li>
                  <li>
                    <div className="pdf-link" onClick={() => openPDF("for")}>
                      <span className="pdf-icon">📄</span>
                      <span className="pdf-text">FOR</span>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="docs-section">
                <h3>State-wise Forecasting and Scheduling Regulations</h3>
                <ul className="docs-list states-list">
                  <li>
                    <div className="pdf-link" onClick={() => openPDF("ap")}>
                      <span className="pdf-icon">📄</span>
                      <span className="pdf-text">Andhra Pradesh</span>
                    </div>
                  </li>
                  <li>
                    <div className="pdf-link" onClick={() => openPDF("gj")}>
                      <span className="pdf-icon">📄</span>
                      <span className="pdf-text">Gujarat</span>
                    </div>
                  </li>
                  <li>
                    <div className="pdf-link" onClick={() => openPDF("kntk")}>
                      <span className="pdf-icon">📄</span>
                      <span className="pdf-text">Karnataka</span>
                    </div>
                  </li>
                  <li>
                    <div className="pdf-link" onClick={() => openPDF("mp")}>
                      <span className="pdf-icon">📄</span>
                      <span className="pdf-text">Madhya Pradesh</span>
                    </div>
                  </li>
                  <li>
                    <div className="pdf-link" onClick={() => openPDF("mh")}>
                      <span className="pdf-icon">📄</span>
                      <span className="pdf-text">Maharashtra</span>
                    </div>
                  </li>
                  <li>
                    <div className="pdf-link" onClick={() => openPDF("rj")}>
                      <span className="pdf-icon">📄</span>
                      <span className="pdf-text">Rajasthan</span>
                    </div>
                  </li>
                  <li>
                    <div className="pdf-link" onClick={() => openPDF("tn")}>
                      <span className="pdf-icon">📄</span>
                      <span className="pdf-text">Tamil Nadu</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </TabPanel>
          
          <TabPanel>
            <div className="calculator-container">
              <Calculator />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default Regulations;