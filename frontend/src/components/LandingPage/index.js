import React from "react";
import coverImage from "../../images/cover.png";
import styles from "./LandingPage.module.css";
import Tab from "../Tab";

export default function LandingPage() {
  return (
    <div className={`container d-flex ${styles.mainContainer}`}>
      <div className={styles.loginContainer}>
        <Tab className={styles.tabStyling} />
      </div>
      <div
        className={`imgContainer d-flex justify-content-center ${styles.imgContainer}`}
      >
        <img
          className={styles.imgStyling}
          src={coverImage}
          alt="landing cover"
        ></img>
      </div>
    </div>
  );
}
