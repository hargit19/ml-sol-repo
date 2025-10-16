import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button, Callout, Dialog, Flex } from "@radix-ui/themes";
import { isEqual } from "lodash";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { conditionsBeforeCalcFlow, updateModelRunsFlow } from "../../../api/conditionsBeforeAfterCalcFlow";
import { runPremiumModel, runQuickModel } from "../../../api/flaskFlow";
import { saveHeaders, updateHeaders } from "../../../api/headersFlow";
import { generatePredictedDataIdFlow } from "../../../api/predictedDataFlow";
import { saveMapLocationFlow } from "../../../api/userFlow";
import { useAuth } from "../../../context/AuthProvider";
import { useMultiStepReducer } from "../../../context/MultiStepFormProvider";
import styles from "../MultiStepForm.module.css";

function StepControls({ currentStep, steps, setCurrentStep, lat, long, setCalcStatus, fileStatus }) {
  const { user } = useAuth();
  const { state, savedHeaders } = useMultiStepReducer();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const { data, validationData, ...newState } = state;

  function handleDecreaseStep() {
    if (error) setError(null);
    setCurrentStep(currentStep - 1);
  }

  function handleIncreaseStep() {
    if (currentStep === 1) {
      if (!state.mode) {
        setError("Please select a mode.");
        return;
      } else if (!state.dateFormat) {
        setError("Please select a date format.");
        return;
      }
    }

    if (currentStep === 2) {
      if (!state.columnHeaders.date) {
        setError("Please select a date column.");
        return;
      }
      if (!state.isDateTimeSameColumn && !state.columnHeaders.time) {
        setError("Please select a time column.");
        return;
      }
      if (state.mode === "solarRadiation" && !state.columnHeaders.solarRadiation) {
        setError("Please select a solar radiation column.");
        return;
      }
      if (state.mode === "pvPower" && !state.columnHeaders.pvPower) {
        setError("Please select a pv power column.");
        return;
      }
    }
    setError(null);
    setCurrentStep(currentStep + 1);
  }

  async function handleSavingHeaders() {
    // remove data from state before sending to backend
    let response;
    if (!savedHeaders) {
      response = await saveHeaders(newState);
    } else {
      response = await updateHeaders(newState, savedHeaders._id);
    }

    if (response.status === "success") {
      handleCalculate();
    } else {
      setError("Something went wrong. Please try again.");
    }
  }

  async function handleAskSaveHeader() {
    if (savedHeaders && isEqual(newState, savedHeaders)) {
      handleCalculate();
    } else {
      setDialogOpen(true);
    }
  }

  async function handleCalculate() {
    setDialogOpen(false);
    const result = await conditionsBeforeCalcFlow(user._id);

    if (result !== "success") {
      setError(result);
      return;
    }
    const usersLastDate = state.data[state.data.length - 1].date;
    const tempDate = new Date(usersLastDate).setDate(new Date(usersLastDate).getDate() + 1);
    const nextDate = new Date(tempDate).toLocaleDateString("en-US");

    setCalcStatus("loading");

    const res = await generatePredictedDataIdFlow(nextDate);

    if (res.status !== "success") {
      setCalcStatus("error");
      return;
    }

    const generatedDataId = res.data.predictedDataId;

    
    const resFlaskQuick = await runQuickModel(state.data, nextDate, user._id, lat, long, generatedDataId);
    console.log("resflashquick" , resFlaskQuick);
    const resFlaskPremium = await runPremiumModel(state.data, nextDate, user._id, lat, long, generatedDataId);
    console.log("resflaskprem" , resFlaskPremium);

    if (resFlaskQuick.message) {
      setCalcStatus("complete");
    } else {
      setCalcStatus("error");
    }

    if (!resFlaskPremium.message) {
      toast.error("Error in running premium model");
    }

    const errorInSavingMapLocation = await saveMapLocationFlow({ lat, long });
    if (errorInSavingMapLocation) {
      toast.error(errorInSavingMapLocation);
    }

    // after models complete, update model runs
    const errorInUpdation = await updateModelRunsFlow(user._id);
    if (errorInUpdation) {
      toast.error(errorInUpdation);
    }
  }

  return (
    <>
      {error && (
        <Callout.Root color="red" role="alert" size={"1"}>
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text style={{ marginBottom: "0" }}>{error}</Callout.Text>
        </Callout.Root>
      )}
      <div className={styles.controls}>
        <Button onClick={handleDecreaseStep} disabled={currentStep === 1}>
          Previous
        </Button>
        {currentStep < steps.length ? (
          <Button onClick={handleIncreaseStep} disabled={currentStep === steps.length}>
            Next
          </Button>
        ) : fileStatus ? (
          <Button variant="solid" color="green" onClick={handleAskSaveHeader}>
            Calculate
          </Button>
        ) : (
          <Button variant="solid" color="gray" disabled>
            Calculate
          </Button>
        )}
      </div>
      <Dialog.Root open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <Dialog.Content width={"20vw"}>
          <Dialog.Title>Save Headers</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Do you want to save these headers for future use?
          </Dialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={handleCalculate}>
              Cancel
            </Button>
            <Button onClick={handleSavingHeaders}>Save</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

export default StepControls;
