import React from "react";
import styles from "../MultiStepForm.module.css";
import FinalStep from "../Steps/FinalStep";
import StepOne from "../Steps/StepOne";
import StepTwo from "../Steps/StepTwo";

function StepContent({ currentStep, lat, long, setCurrentStep, setFileStatus }) {
  return (
    <div className={styles["form-steps"]}>
      {currentStep === 1 && <StepOne lat={lat} long={long} setCurrentStep={setCurrentStep} />}
      {currentStep === 2 && <StepTwo />}
      {currentStep === 3 && <FinalStep setFileStatus={setFileStatus} />}
    </div>
  );
}

export default StepContent;
