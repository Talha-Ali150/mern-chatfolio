import React from "react";
import coverImage from "../../images/cover.png";
import "../LandingPage/LandingPage.css";
import LoginForm from "../LoginForm";

export default function LandingPage() {
  return (
    <div className="container d-flex">
      <div className="loginContainer w-50">
        <LoginForm />
      </div>
      <div className="imgContainer d-flex w-50 justify-content-center   ">
        <img className="imgStyling" src={coverImage} alt="landing cover"></img>
      </div>
    </div>
  );
}
