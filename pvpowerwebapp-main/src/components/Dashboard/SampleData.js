import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { toast } from "react-toastify";
import { getCSVContentsFlow } from "../../api/fileFlow";
import "../../css/Dashboard/SampleData.css";

function SampleData() {
  const [selectedState, setSelectedState] = useState("Roorkee");
  const [Data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  useEffect(() => {
    switch (selectedState) {
      case "Roorkee":
        fetchData("PCCD3");
        break;

      case "Kurukshetra":
        fetchData("PCCD4");
        break;

      case "Saharanpur":
        fetchData("PCCD1");
        break;

      case "Greater Noida":
        fetchData("PCCD2");
        break;

      case "Vikas Nagar":
        fetchData("PCCD5");
        break;

      case "Tanakpur":
        fetchData("PCCD6");
        break;

      default:
        break;
    }
  }, [selectedState]);

  async function fetchData(locationCode) {
    setLoading(true);
    const result = await getCSVContentsFlow(locationCode);
    console.log("data fetched: ", result);

    if (result.status !== "success") {
      toast.error("Could not fetch data");
      return;
    }

    const data = result.data;

    setData(data);
    setLoading(false);
  }

  const plotData = [
    {
      y: Data.LSTM,
      x: Data.date,
      type: "scatter",
      mode: "lines",
      marker: {
        color: "red",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      name: process.env.REACT_APP_MODEL_LSTM,
      visible: process.env.REACT_APP_SHOW_MODEL_LSTM,
    },
    {
      y: Data.OurModel,
      x: Data.date,
      type: "scatter",
      mode: "lines",
      marker: {
        color: "green",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      name: "Our Model",
      visible: true,
    },
    {
      y: Data.Actual,
      x: Data.date,
      type: "scatter",
      mode: "lines",
      marker: {
        color: "blue",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      name: process.env.REACT_APP_MODEL_ACTUAL_DATA,
      visible: process.env.REACT_APP_SHOW_MODEL_ACTUAL,
    },
  ];

  const layout = {
    title: `Data ${selectedState}`,
    yaxis: {
      title: "GHI",
      showgrid: false,
    },
    xaxis: {
      title: "Time (drag axis from side)",
      showgrid: false,
      showticklabels: true,
      type: "date",
    },
    rangeselector: {
      buttons: [
        {
          count: 1,
          label: "1d",
          step: "day",
          stepmode: "backward",
        },
        {
          count: 7,
          label: "1w",
          step: "day",
          stepmode: "backward",
        },
        {
          count: 1,
          label: "1m",
          step: "month",
          stepmode: "backward",
        },
        {
          count: 6,
          label: "6m",
          step: "month",
          stepmode: "backward",
        },
        {
          count: 1,
          label: "1y",
          step: "year",
          stepmode: "backward",
        },
        { step: "all" },
      ],
    },
    tickformatstops: [
      { dtickrange: [null, 1000], value: "%b %d" },
      { dtickrange: [1000, 86400000], value: "%b %d, %Y" },
      { dtickrange: [86400000, 604800000], value: "%Y-%m-%d" },
      { dtickrange: [604800000, "M1"], value: "%Y-%m-%d" },
      { dtickrange: ["M1", null], value: "%Y" },
    ],
  };
  if (loading) {
    return (
      <>
        <div className="plot__container">
          <div className="main__header">
            <p className="dheader__greet" style={{ color: "#1f1914" }}>
              This website segment offers real-time weather forecasts from six strategically positioned weather stations
              located throughout India. The predictions are derived from ground data collected by these weather
              stations.
            </p>
          </div>
          <div className="main__plot">
            <select value={selectedState} onChange={handleStateChange} className="state_select">
              <option value="">Select State</option>
              <option value="Greater Noida">Greater Noida</option>
              <option value="Kurukshetra">Kurukshetra</option>
              <option value="Roorkee">Roorkee</option>
              <option value="Saharanpur">Saharanpur</option>
              <option value="Vikas Nagar">Vikas Nagar</option>
            </select>
            <p>Loading</p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="plot__container">
        <div className="main__header">
          <p className="dheader__greet" style={{ color: "#1f1914" }}>
            This website segment offers real-time weather forecasts from six strategically positioned weather stations
            located throughout India. The predictions are derived from ground data collected by these weather stations.
          </p>
        </div>
        <div className="main__plot">
          <select value={selectedState} onChange={handleStateChange} className="state_select">
            <option value="">Select State</option>
            <option value="Greater Noida">Greater Noida</option>
            <option value="Kurukshetra">Kurukshetra</option>
            <option value="Roorkee">Roorkee</option>
            <option value="Saharanpur">Saharanpur</option>
            <option value="Vikas Nagar">Vikas Nagar</option>
          </select>
          {selectedState !== "" ? (
            <Plot className="plot" data={plotData} config={{ responsive: true }} layout={layout} />
          ) : (
            <p>Please select state</p>
          )}
        </div>
      </div>
    </>
  );
}

export default SampleData;
