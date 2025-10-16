import React from "react";
import styles from "../MultiStepForm.module.css";
import { CheckCircledIcon } from "@radix-ui/react-icons";

const StepNavbar = ({ steps, currentStep }) => (
  <div className={styles["stepper"]}>
    <div
      className={styles["step-line-form"]}
      style={{
        width: `${((currentStep - 1) / (steps.length - 1)) * 90}%`,
      }}
    ></div>
    {steps.map((step, index) => (
      <React.Fragment key={index}>
        <div className={styles["step"]}>
          <div className={`${styles["step-circle"]} ${currentStep >= step.number ? styles["active"] : ""}`}>
            {currentStep > step.number ? <CheckCircledIcon /> : step.number}
          </div>
          <div className={styles["step-description"]}>{step.description}</div>
        </div>
      </React.Fragment>
    ))}
  </div>
);

export default StepNavbar;
