import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import setup images
import Setup from "../Images/Setup.jpg";
import Setup1 from "../Images/Setup1.jpg";

// Import custom CSS
import "../css/Pages/Setup.css";

function OurSetup() {
  return (
    <div className="setup__section">
      <div className="setup__title">
        <h2>Our System</h2>
        <div className="setup__underline"></div>
      </div>
      
      <div className="setup__container">
        <div className="setup__text">
          <div className="setup__text-content">
            <h3>Advanced Forecasting Technology</h3>
            <p>
              Experience live weather integration within our forecasting system, courtesy of our collaboration 
              with IIT Roorkee. Our platform provides real-time weather insights crucial for accurate PV power 
              predictions.
            </p>
            <div className="setup__features">
              <div className="setup__feature-item">
                <div className="setup__feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Real-time Weather Data</span>
              </div>
              <div className="setup__feature-item">
                <div className="setup__feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Advanced Analytics</span>
              </div>
              <div className="setup__feature-item">
                <div className="setup__feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Precision Monitoring</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="setup__carousel">
          <Swiper
            navigation={true}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination, Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="setup__swiper"
          >
            <SwiperSlide>
              <div className="setup__slide">
                <img src={Setup} alt="Setup" />
                <div className="setup__caption">
                  <p>Advanced Monitoring Equipment</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="setup__slide">
                <img src={Setup1} alt="Setup1" />
                <div className="setup__caption">
                  <p>Real-time Data Collection</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default OurSetup;