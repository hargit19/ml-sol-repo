import { CheckCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Box, Button, Callout, Dialog, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { getHeaders } from "../../api/headersFlow";
import { getPredictedDataFlow, saveValidationDataFlow } from "../../api/predictedDataFlow";
import { useAuth } from "../../context/AuthProvider";
import { useMultiStepReducer } from "../../context/MultiStepFormProvider";
import "../../css/Dashboard/Validate.css";
import getDataFile from "../../utils/excelFileVerify";
import PenaltyCalculate from "./PenaltyCalculate";

function stripTimeFromDate(date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate.getTime();
}

function Validate() {
  const { user } = useAuth();
  const [savedHeaders, setSavedHeaders] = useState(null);
  const [predictedData, setPredictedData] = useState(null);
  const [messageDis, setMessageDis] = useState(null);
  const { state, dispatchMultiStep } = useMultiStepReducer();

  const [headerDialogOpen, setHeaderDialogOpen] = useState(true);
  const [noPremiumDialogOpen, setNoPremiumDialogOpen] = useState(false);

  async function saveValidationData(data) {
    const result = await saveValidationDataFlow(data);
    if (result.status !== "success") {
      setMessageDis({ status: result.status, message: result.message });
      return;
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files[0];
    const result = await getDataFile(file, savedHeaders);

    if (result.status === "error") {
      setMessageDis({ status: result.status, message: result.message });
      return;
    }

    const datePredictedinMs = stripTimeFromDate(predictedData.date);

    const validationDataOfDate = result.data.filter((item) => stripTimeFromDate(item.date) === datePredictedinMs);

    console.log(validationDataOfDate);

    await saveValidationData(validationDataOfDate);

    dispatchMultiStep({ type: "SET_VALIDATION_DATA", payload: validationDataOfDate });
  }

  useEffect(() => {
    async function handlePredictedData() {
      const result = await getPredictedDataFlow();
      if (result.status !== "success") {
        setMessageDis({ status: "error", message: result.message });
        return;
      }
      setPredictedData(result.data.predictedData);
    }

    async function handleHeaders() {
      const result = await getHeaders();
      if (result.status !== "success") {
        if (!result.message === "No header found for this user") {
          setMessageDis({ status: "error", message: result.message });
        }
        return;
      }
      setSavedHeaders(result.data.header);
    }

    handleHeaders();
    handlePredictedData();
  }, []);

  useEffect(() => {
    if (predictedData && state.validationData && !predictedData?.premium.length) {
      setNoPremiumDialogOpen(true);
    }
  }, [predictedData, state.validationData]);

  if (!state.validationData) {
    return (
      <div className="plot__container">
        <div className="main__header">
          <p className="dheader__greet" style={{ color: "#1f1914" }}>
            Welcome {user.username}
          </p>
        </div>
        <div className="main__plot">
          <Box width={"20vw"} className="centeredBox">
            <Flex direction={"column"} gap={"4"}>
              <div>
                <Text as="p" size={"2"} weight={"medium"}>
                  Upload your .xlsx, .csv or .xls file:
                </Text>
                <input type="file" className={"FileInput"} onChange={handleFileChange} accept=".xlsx, .xls, .csv" />
              </div>
              {messageDis && (
                <Callout.Root
                  className="callout-root"
                  color={messageDis.status === "error" ? "red" : "green"}
                  size={"1"}
                >
                  <Callout.Icon>
                    {messageDis.status === "error" ? <ExclamationTriangleIcon /> : <CheckCircledIcon />}
                  </Callout.Icon>
                  <Callout.Text style={{ marginBottom: "0" }}>{messageDis.message}</Callout.Text>
                </Callout.Root>
              )}
            </Flex>
          </Box>
        </div>
        <Dialog.Root open={headerDialogOpen} onClose={() => setHeaderDialogOpen(false)}>
          <Dialog.Content width={"20vw"}>
            <Dialog.Title>Info</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              You have to use the same headers as the uploaded file.
            </Dialog.Description>

            <Flex gap="3" mt="4" justify="end">
              <Button variant="soft" onClick={() => setHeaderDialogOpen(false)}>
                OK
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    );
  }

  if (!predictedData || !savedHeaders) {
    return (
      <div className="plot__container">
        <div className="main__header">
          <p className="dheader__greet" style={{ color: "#1f1914" }}>
            Welcome {user.username}
          </p>
        </div>
        <div className="main__plot">
          <Box width={"20vw"} className="centeredBox">
            <Flex direction={"column"} gap={"4"}>
              <div>
                <Text as="p" size={"2"} weight={"medium"}>
                  No forecasted data found.
                </Text>
              </div>
              <div>
                <Text as="p" size={"2"} weight={"medium"}>
                  Upload your .xlsx, .csv or .xls file:
                </Text>
                <input type="file" className={"FileInput"} onChange={handleFileChange} accept=".xlsx, .xls, .csv" />
              </div>
              {messageDis && (
                <Callout.Root
                  className="callout-root"
                  color={messageDis.status === "error" ? "red" : "green"}
                  size={"1"}
                >
                  <Callout.Icon>
                    {messageDis.status === "error" ? <ExclamationTriangleIcon /> : <CheckCircledIcon />}
                  </Callout.Icon>
                  <Callout.Text style={{ marginBottom: "0" }}>{messageDis.message}</Callout.Text>
                </Callout.Root>
              )}
            </Flex>
          </Box>
        </div>
      </div>
    );
  }

  if (state.validationData.length === 0) {
    return (
      <div className="plot__container">
        <div className="main__header">
          <p className="dheader__greet" style={{ color: "#1f1914" }}>
            Welcome {user.username}
          </p>
        </div>
        <div className="main__plot">
          <Box width={"20vw"} className="centeredBox">
            <Flex direction={"row"} gap={"4"} justify={"center"}>
              <div>
                <Text as="p" size={"3"} weight={"bold"}>
                  No data found for {new Date(predictedData.date).toLocaleDateString("en-GB")}.
                </Text>
                <Text as="p" size={"3"} weight={"bold"}>
                  Please upload the next day's data to see validation.
                </Text>
              </div>
            </Flex>
            <Flex direction={"column"} gap={"4"}>
              <div>
                <Text as="p" size={"2"} weight={"medium"}>
                  Upload your .xlsx, .csv or .xls file:
                </Text>
                <input type="file" className={"FileInput"} onChange={handleFileChange} accept=".xlsx, .xls, .csv" />
              </div>
              {messageDis && (
                <Callout.Root
                  className="callout-root"
                  color={messageDis.status === "error" ? "red" : "green"}
                  size={"1"}
                >
                  <Callout.Icon>
                    {messageDis.status === "error" ? <ExclamationTriangleIcon /> : <CheckCircledIcon />}
                  </Callout.Icon>
                  <Callout.Text style={{ marginBottom: "0" }}>{messageDis.message}</Callout.Text>
                </Callout.Root>
              )}
            </Flex>
          </Box>
        </div>
      </div>
    );
  }

  const forecastedQuick = predictedData.quick.map((item) => item.PredictedPV);
  const forecastedPremium = predictedData.premium.map((item) => item.PredictedPV);
  const actualData = savedHeaders.columnHeaders.solarRadiation
    ? state.validationData.map((item) => item.solarRadiation)
    : state.validationData.map((item) => item.pvPower);
  const timeArray = predictedData.quick.map((item) => item.time);

  const plotData = [
    {
      y: forecastedQuick,
      x: timeArray,
      type: "scatter",
      mode: "lines",
      name: "Quick Model",
      marker: {
        color: "blue",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      visible: true,
      fill: "tozeroy", // Fill the area under the line graph
      fillcolor: "rgba(0, 0, 255, 0.1)", // Set the color and opacity of the filled area
    },
    {
      y: forecastedPremium,
      x: timeArray,
      type: "scatter",
      mode: "lines",
      name: "Premium Model",
      marker: {
        color: "red",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      visible: true,
      fill: "tozeroy",
      fillcolor: "rgba(255, 0, 0, 0.1)",
    },
    {
      y: actualData,
      x: timeArray,
      type: "scatter",
      mode: "lines",
      name: "Actual Data",
      marker: {
        color: "pink",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      visible: true,
      fill: "tozeroy",
      fillcolor: "rgba(255, 0, 0, 0.1)",
    },
  ];

  const layout = {
    title: `Validation for ${new Date(predictedData.date).toLocaleDateString("en-GB")}`,
    yaxis: {
      title: savedHeaders.columnHeaders.pvPower ? "PV Power" : "Solar Radiation",
      showgrid: false,
    },
    xaxis: {
      title: "Time",
      showgrid: false,
      showticklabels: true,
      type: "time",
    },
    autosize: true,
  };

  const quickErrors = forecastedQuick.map((item, index) => {
    return item - actualData[index];
  });

  const premiumErrors = forecastedPremium.map((item, index) => {
    return item - actualData[index];
  });

  const errorPlotData = [
    {
      y: quickErrors,
      x: timeArray,
      type: "bar",
      name: "Quick",
      marker: { color: "green" },
      visible: true,
    },
    {
      y: premiumErrors,
      x: timeArray,
      type: "bar",
      name: "Premium",
      marker: { color: "blue" },
      visible: true,
    },
  ];

  const errorlayout = {
    title: `Deviation for ${new Date(predictedData.date).toLocaleDateString("en-GB")}`,
    yaxis: {
      title: "Error",
      showgrid: false,
    },
    xaxis: {
      title: "Time",
      showgrid: false,
      showticklabels: true,
      type: "time",
    },
    autosize: true,
  };

  return (
    <div className="plot__container">
      <Flex direction={"column"} gap={"4"}>
        <div>
          <Text as="p" size={"2"} weight={"medium"}>
            Upload your .xlsx, .csv or .xls file:
          </Text>
          <input type="file" className={"FileInput"} onChange={handleFileChange} accept=".xlsx, .xls, .csv" />
        </div>
        {messageDis && (
          <Callout.Root className="callout-root" color={messageDis.status === "error" ? "red" : "green"} size={"1"}>
            <Callout.Icon>
              {messageDis.status === "error" ? <ExclamationTriangleIcon /> : <CheckCircledIcon />}
            </Callout.Icon>
            <Callout.Text style={{ marginBottom: "0" }}>{messageDis.message}</Callout.Text>
          </Callout.Root>
        )}
      </Flex>
      <div className="main__plot">
        <div className="table-container">
          <div className="table-row">
            <div className="table-cell">
              <Plot className="plot" data={plotData} config={{ responsive: true }} layout={layout} />
            </div>
            <div className="table-cell">
              <Plot className="plot" data={errorPlotData} config={{ responsive: true }} layout={errorlayout} />
            </div>
          </div>
          <PenaltyCalculate quickErrors={quickErrors} premiumErrors={premiumErrors} date={predictedData.date} />
        </div>
      </div>
      <Dialog.Root open={noPremiumDialogOpen} onClose={() => setNoPremiumDialogOpen(false)}>
        <Dialog.Content width={"20vw"}>
          <Dialog.Title>Info</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Premium model is still running. You can validate with quick model for now.
          </Dialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" onClick={() => setNoPremiumDialogOpen(false)}>
              OK
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

export default Validate;
