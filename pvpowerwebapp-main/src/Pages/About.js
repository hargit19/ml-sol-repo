import React, { useState, useEffect, useRef } from "react";
import "../css/Pages/About.css";
import target from "../Images/target.svg";

const TypeWriter = ({ textToShow, delay }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < textToShow.length) {
      const timeout = setTimeout(() => {
        setCurrentText(currentText + textToShow[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, textToShow, currentText]);

  return <span>{currentText}</span>;
};

function About() {
  const missionRef = useRef(null);

  useEffect(() => {
    // Set all reveals to active initially for better visibility
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach(item => {
      item.classList.add("active");
    });

    function reveal() {
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    }

    window.addEventListener("scroll", reveal);

    // Call reveal once initially to handle elements that are visible on page load
    reveal();

    return () => {
      window.removeEventListener("scroll", reveal);
    };
  }, []);

  return (
    <div className="about__container">
      <div className="mission__container">
        <img src={target} alt="Target illustrating our mission" />
        <div className="para">
          <h1>
            <TypeWriter textToShow={"OUR MISSION"} delay={120} />
          </h1>
          <h2>
            <TypeWriter 
              textToShow={"To be India's best forecasting and Penalty Reduction Tool for renewable energy."} 
              delay={60} 
            />
          </h2>
        </div>
      </div>
      
      <div className="about__team reveal active" ref={missionRef}>
        <h1 className="reveal active fade-bottom">Meet Our Team</h1>
        <p className="reveal active fade-bottom">
          Powered by a strong team of industry experts, engineers, and renewable energy enthusiasts.
        </p>
        
        <div className="team-card">
          <h2 className="reveal active fade-bottom">Advisors</h2>
          
          <div className="team-member reveal active fade-left">
            <div className="team-member-img team-member2"></div>
            <div className="team-member-txt">
              <p>
                <a href="https://www.iitr.ac.in/~CSE/Raksha_Sharma">Prof. Raksha Sharma</a>
              </p>
              <p>Founder, Assistant Professor at Department of CS, IIT Roorkee</p>
              <p>
                RESEARCH INTERESTS: Natural Language Processing, Application of Machine Learning, Image Processing for Text Generation
              </p>
            </div>
          </div>
          
          <div className="team-member reveal active fade-right">
            <div className="team-member-img team-member3"></div>
            <div className="team-member-txt">
              <p>
                <a href="https://www.iitr.ac.in/~HRE/Rhythm_Singh">Prof. Rhythm Singh</a>
              </p>
              <p>Founder, Associate Professor at Department of HRE, IIT Roorkee</p>
              <p>
                RESEARCH INTERESTS: Solar PV systems, Rooftop PV applications, Solar resource variability assessment, Application of AI/ML/Fintech to renewable energy, Grid-connected renewable energy systems
              </p>
            </div>
          </div>
          
          <h2 className="reveal active fade-bottom">Developers</h2>
          <div className="developers-container">
            <div className="team-member reveal active fade-bottom">
              <div className="team-member-img team-member1"></div>
              <div className="team-member-txt">
                <p>
                  <a href="https://www.linkedin.com/in/arthr/">Abhijeet Rathore</a>
                </p>
                <p>Research Scholar, IITR</p>
              </div>
            </div>

            <div className="team-member reveal active fade-bottom">
              <div className="team-member-img team-member6"></div>
              <div className="team-member-txt">
                <p>
                  <a href="https://www.linkedin.com/in/dr-priya-gupta-640077209/?originalSubdomain=in">Priya Gupta</a>
                </p>
                <p>Data Scientist at Ola Electric</p>
              </div>
            </div>
            
            <div className="team-member reveal active fade-bottom">
              <div className="team-member-img team-member4"></div>
              <div className="team-member-txt">
                <p>
                  <a href="https://www.linkedin.com/in/md-alfez-mansuri-3aba3224a/">Alfez Mansuri</a>
                </p>
                <p>Full Stack Developer</p>
              </div>
            </div>
            
            <div className="team-member reveal active fade-bottom">
              <div className="team-member-img team-member5"></div>
              <div className="team-member-txt">
                <p>
                  <a href="https://www.linkedin.com/in/anmol-varshney-1aa04121a/">Anmol Kumar Varshney</a>
                </p>
                <p>Full Stack Developer</p>
              </div>
            </div>
            
            

            <div className="team-member reveal active fade-bottom">
              <div className="team-member-img team-member7"></div>
              <div className="team-member-txt">
                <p>
                  <a href="https://www.linkedin.com/in/hardik-advani-441456250/">Hardik Advani</a>
                </p>
                <p>Full Stack Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;