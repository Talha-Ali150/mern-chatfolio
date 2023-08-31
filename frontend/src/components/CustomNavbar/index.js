import React from "react";
import styles from "./CustomNavbar.module.css";
import logo from "../../images/logo.svg";

export default function CustomNavbar() {
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.imgContainer}>
        <img className={styles.imgStyling} src={logo} alt="logo" />
      </div>
    </div>
  );
}
