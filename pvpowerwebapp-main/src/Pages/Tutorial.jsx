import React, { useState, useEffect, useRef } from "react";
import dashboardImg from "../Images/dashboard.png";
import dashboardImg2 from "../Images/dashboard_step2.png";
import dashboardImg3 from "../Images/dashboard_step3.png";
import dashboardImg4 from "../Images/dashboard_step4.png";
import dashboardImg5 from "../Images/dashboard_step5.png";
import dashboardImg6 from "../Images/dashboard_step6.png";
import "../css/Pages/Tutorial.css";
import visualize from "../Images/visualize.png";
import account from "../Images/userAccount.png";
import forecast from "../Images/forecast.png";
import validate from "../Images/validate.png";
import history from "../Images/history.png";
import sampleData from "../Images/sampleData.png";

function Tutorial() {
  const [activeLink, setActiveLink] = useState("upload");
  
  // Create refs for each section
  const sectionRefs = {
    upload: useRef(null),
    visualize: useRef(null),
    account: useRef(null),
    forecast: useRef(null),
    validate: useRef(null),
    sample: useRef(null),
    history: useRef(null)
  };

  // Define all tutorial sections for easier management
  const tutorialSections = [
    { id: "upload", title: "Upload the data" },
    { id: "visualize", title: "Visualize" },
    { id: "account", title: "Account" },
    { id: "forecast", title: "Get forecast" },
    { id: "validate", title: "Validate Data" },
    { id: "sample", title: "Sample Data" },
    { id: "history", title: "View older Data" },
  ];
  
  // Function to handle scroll to section
  const scrollToSection = (id) => {
    setActiveLink(id);
    if (sectionRefs[id] && sectionRefs[id].current) {
      sectionRefs[id].current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Check which section is in view for highlighting sidebar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset to detect section earlier
      
      // Find which section is currently visible
      for (const section of tutorialSections) {
        const element = sectionRefs[section.id].current;
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveLink(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="tut">
      <div className="tutorial__sidebar">
        <p>Tutorial</p>
        <ul>
          <li>
            <p>Overview</p>
          </li>
          <li>
            <p>Guide</p>
            <ul>
              {tutorialSections.map((section) => (
                <li key={section.id}>
                  <a
                    className={`sidebar-link-to-content ${activeLink === section.id ? "active" : ""}`}
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(section.id);
                    }}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
      <div className="tutorial__container">
        <h1 className="tut__overview" id="overview">Overview</h1>
        <p className="tut-overview-txt">
          In this tutorial, we explore the field of PV power prediction using our platform PVcast. By leveraging data
          and advanced algorithms, we accurately estimate the energy production of solar panels based on various input
          parameters.
        </p>
        
        <h2>How to Guide</h2>
        <div className="step" id="upload" ref={sectionRefs.upload}>
          <h3><span className="step-number">1</span>Upload data for forecasting</h3>
          <p>After login, you will see a dashboard like this</p>
          <img src={dashboardImg} alt="Dashboard home screen" />
          <p>This is the dashboard home page.</p>
          <p>
            You need to select your desired location either by dragging the marker to that location or typing the
            location name in the popup that appears when marker is clicked.
          </p>

          <img src={dashboardImg2} alt="Location selection on dashboard" />
          <p>Click on set location button and another pop-up will show like this:</p>
          <img src={dashboardImg3} alt="Data upload popup" />
          <p>Give the required information. Date and PV power is a must.</p>
          <p>Also only .xlsx and .csv files are allowed</p>
          <p>
            After uploading the excel, it will check for the format in the background. If the format is correct then you
            will be allowed to submit your data.
          </p>
          <p>After clicking submit, calculation will happen in the backend which can take some time.</p>
          <img src={dashboardImg4} alt="Processing calculation" />
          <p>
            You don't need to wait for calculations to happen. You can close your browser and when the calculations will
            be completed, you will be notified on your registered mail
          </p>
          <p>After calculations are done, you will see a pop-up like this:</p>
          <img src={dashboardImg5} alt="Calculation completed" />
          <img src={dashboardImg6} alt="Calculation completed" />
          <p>Now you can view full forecast. It's that easy!</p>
        </div>

        <div className="step" id="visualize" ref={sectionRefs.visualize}>
          <h3><span className="step-number">2</span>Visualize Tab</h3>
          <p>
            After uploading data, this tab has the plot of your uploaded data which you can download.
            <br />
            It looks like this:
          </p>
          <img src={visualize} alt="Visualization interface" />
          <p>You can view your data for different dates and export the visualizations as needed.</p>
        </div>

        <div className="step" id="account" ref={sectionRefs.account}>
          <h3><span className="step-number">3</span>Account</h3>
          <p>
            You can view your account details and also edit them from this tab.
            <br />
            It looks like this:
          </p>
          <img src={account} alt="Account management interface" />
          <p>Update your profile information and manage your account settings from this section.</p>
        </div>

        <div className="step" id="forecast" ref={sectionRefs.forecast}>
          <h3><span className="step-number">4</span>Forecast</h3>
          <p>
            This tab shows you your latest forecast calculation on a plot. You can also download excel sheet of your
            forecast results from here by selecting it from history tab.
            <br /> Also you can view results of different forecasting models.
            <br />
            It looks like this:
          </p>
          <img src={forecast} alt="Forecast results interface" />
          <p>Compare different prediction models and export the results for your analysis.</p>
        </div>

        <div className="step" id="validate" ref={sectionRefs.validate}>
          <h3><span className="step-number">5</span>Validate</h3>
          <p>
            You can validate forecast results in this tab by uploading your actual data that you got on particular
            dates. You can also calculate penalties.
            <br />
            It looks like this:
          </p>
          <img src={validate} alt="Data validation interface" />
          <p>Assess the accuracy of forecasts by comparing with actual recorded values.</p>
        </div>

        <div className="step" id="sample" ref={sectionRefs.sample}>
          <h3><span className="step-number">6</span>Sample Data</h3>
          <p>
            Compare various model's precision of forecasts done on different locations.
            <br />
            This website segment offers real-time weather forecasts from six strategically positioned weather stations
            located throughout India. The predictions are derived from ground data collected by these weather stations.
            It looks like this:
          </p>
          <img src={sampleData} alt="Sample data interface" />
          <p>Explore pre-loaded sample data to understand the system's capabilities before uploading your own.</p>
        </div>

        <div className="step" id="history" ref={sectionRefs.history}>
          <h3><span className="step-number">7</span>History</h3>
          <p>
            In this tab you can view all your previous calculations. You can view and delete your history.
            <br />
            It looks like this:
          </p>
          <img src={history} alt="History view interface" />
          <p>Access your past forecasts and manage your calculation history in one place.</p>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;