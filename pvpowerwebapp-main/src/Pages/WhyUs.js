import React from "react";
import "../css/Pages/WhyUs.css";
import { TbTargetArrow } from "react-icons/tb";
import { GiTeamIdea } from "react-icons/gi";
import { FaHandsHelping } from "react-icons/fa";

function WhyUs() {
  return (
    <div className="about__why">
      <p style={{ color: "#1c1914", fontSize: "2.5em", fontWeight: "600" }}>Why Us ?</p>

      <div className="why-cards  ">
        <div className="why-card  ">
          <TbTargetArrow className="why-icons " />
          <p className="card-title ">Accurate Predictions</p>
          <p className="card-desc ">
            Backed by IIT Roorkee, our machine learning models ensure precise PV power predictions. Utilizing advanced
            algorithms and real-time data analysis, we deliver highly accurate forecasts, trusted by clients. Our
            commitment to accuracy and numerous success stories validate our reliability.
          </p>
        </div>
        <div className="why-card ">
          <GiTeamIdea className="why-icons " />
          <p className="card-title ">Customized Solutions</p>
          <p className="card-desc ">
            As an IIT Roorkee incubated startup, we offer personalized PV power forecasts. Adaptable to diverse
            scenarios and solar setups, our solutions cater uniquely to each client’s needs, optimizing solar power
            planning efficiency.
          </p>
        </div>
        <div className="why-card ">
          <FaHandsHelping className="why-icons " />
          <p className="card-title ">User-Friendly Platform</p>
          <p className="card-desc ">
            Experience our user-friendly platform, crafted with intuitive visuals and simple navigation. Accessible on
            any device, our interface transforms complex data into actionable insights, empowering confident
            decision-making.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WhyUs;
