import React from "react";
import "./Banner.css"; // Updated CSS file

const Banner = () => {
  return (
    <div className="banner">
      <h2>Welcome to Our Employee Management System</h2>
      <p>Streamline your HR processes and manage your workforce efficiently.</p>
      <div>
        <img
          src="https://www.vertiv.com/49c34d/globalassets/images/on-page-image/800x600/800x600-103323_103330_0.jpg"
          alt="Employee Management"
        />
      </div>
      <button>Get Started</button>
    </div>
  );
};

export default Banner;
