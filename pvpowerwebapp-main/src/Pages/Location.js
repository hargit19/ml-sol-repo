import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import location images
import GN from "../Images/Location/GN.jpg";
import KK from "../Images/Location/Kurukshetra.jpg";
import Roorkee from "../Images/Location/Roorkee.jpg";
import Sh from "../Images/Location/Saharanpur.jpg";
import Tk from "../Images/Location/Tanakpur.jpg";
import VN from "../Images/Location/vikasnagar.jpg";

// Import custom CSS
import "../css/Pages/Location.css";

function Location() {
  const locations = [
    { name: "Roorkee", image: Roorkee },
    { name: "Saharanpur", image: Sh },
    { name: "Greater Noida", image: GN },
    { name: "Kurukshetra", image: KK },
    { name: "Tanakpur", image: Tk },
    { name: "Vikas Nagar", image: VN },
  ];

  return (
    <div className="location__section">
      <div className="location__title">
        <h2>Our Stations</h2>
        <div className="location__underline"></div>
      </div>
      
      <div className="location__container">
        <div className="location__carousel">
          <Swiper
            navigation={true}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination, Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="location__swiper"
          >
            {locations.map((location, index) => (
              <SwiperSlide key={index}>
                <div className="location__slide">
                  <img src={location.image} alt={location.name} />
                  <div className="location__name">
                    <p>{location.name}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <div className="location__text">
          <div className="location__text-content">
            <h3>Available Monitoring Stations</h3>
            <p>
              We have our stations in various locations across the region. Select your nearest 
              location to get the most accurate and precised forecast. You can also compare data 
              from different stations through our interactive dashboard in the sample data tab.
            </p>
            <div className="location__stations">
              {locations.map((location, index) => (
                <div key={index} className="location__station-badge">
                  {location.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;