import React from "react";
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";
import Employees from "./EmployeeList";

const LandingPage = ({ state, account }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          flex: 1,
        }}
      >
        <Header account={account} />
        <Banner />
        <Employees state={state} />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
