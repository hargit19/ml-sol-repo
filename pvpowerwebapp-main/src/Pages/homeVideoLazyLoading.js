import React from "react";
import homeVid from "../videos/homeVideo.mp4";
import imageTry from "../Images/Imagetry.jpg";

function homeVideoLazyLoading() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
    >
      <source src={homeVid} type="video/mp4" />
      <img src={imageTry} alt="Background GIF" className="hero__gif" />
    </video>
  );
}

export default homeVideoLazyLoading;
