import React, { useState } from "react";
import styles from "./MultiStepForm.module.css";
import CalcComplete from "./components/CalcComplete";
import CalcError from "./components/CalcError";
import CalcLoading from "./components/CalcLoading";
import StepContent from "./components/StepContent";
import StepControls from "./components/StepControls";
import StepNavbar from "./components/StepNavbar";

function MultiStepForm({ lat, long }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [calcStatus, setCalcStatus] = useState(false);
  const [fileStatus, setFileStatus] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const steps = [
    { number: 1, description: "Choose Mode" },
    { number: 2, description: "Select Columns" },
    { number: 3, description: "Calculate" },
  ];

  if (calcStatus === "loading") {
    return <CalcLoading />;
  }

  if (calcStatus === "error") {
    return <CalcError />;
  }

  if (calcStatus === "complete") {
    return ( isModalOpen && (
    <CalcComplete onClose={closeModal} />
    )
  )
  }

  return (
    <div className={styles["main-container"]}>
      <StepNavbar steps={steps} currentStep={currentStep} />
      <StepContent
        currentStep={currentStep}
        lat={lat}
        long={long}
        setCurrentStep={setCurrentStep}
        setFileStatus={setFileStatus}
      />
      <StepControls
        currentStep={currentStep}
        steps={steps}
        setCurrentStep={setCurrentStep}
        lat={lat}
        long={long}
        setCalcStatus={setCalcStatus}
        fileStatus={fileStatus}
      />
    </div>
  );
}

export default MultiStepForm;
