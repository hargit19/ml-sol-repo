import { useEffect, useState } from "react";
import { getValidatedDataFlow } from "../../api/predictedDataFlow";
import "../../css/Dashboard/UserHistory.css";
import Plot from "react-plotly.js";

function ValidationHistory() {
  const [validationHistory, setValidationHistory] = useState(null);
  const [noContent, setNoContent] = useState(false);

  useEffect(() => {
    async function getValidationHistory() {
      try {
        const result = await getValidatedDataFlow();
        if (result.status !== "success") {
          console.log(result.message);
        }
        console.log("check for this data", result);
        if(result.data.validationDataHistory.length === 0){
            setNoContent(true);
        }

        setValidationHistory(result.data.validationDataHistory);
      } catch (error) {
        console.log(error.response.data);
      }
    }

    getValidationHistory();
  }, []);

  console.log("this data is being read", validationHistory);

  if (!validationHistory) {
    return <div>Loading...</div>;
  }

  const singleData = validationHistory[0];

  const timeArray = singleData?.quick.map((item) => item.time);
  const forecastedQuick = singleData?.quick.map((item) => item.PredictedPV);
  const forecastedPremium = singleData?.premium.map((item) => item.PredictedPV);
  const actualData = singleData?.actual.map((item) => item.ActualPV);

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
    title: `Validation for ${new Date(singleData.date).toLocaleDateString("en-GB")}`,
    yaxis: {
      title: "Solar Radiation",
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
  <div>
    {noContent ? (
      <div>No available files to verify</div>
    ) : (
      <Plot
        className="plot"
        data={plotData}
        config={{ responsive: true }}
        layout={layout}
      />
    )}
  </div>
);
}

export default ValidationHistory;
