import { Slider } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useAuth } from "../../context/AuthProvider";
import { useMultiStepReducer } from "../../context/MultiStepFormProvider";
import "../../css/Dashboard/ShowGraph.css";

function Visualise() {
  const { user } = useAuth();
  const { state } = useMultiStepReducer();
  const [sliderValue, setSliderValue] = useState([0, 100]);

  function handleSliderChange(value) {
    setSliderValue(value);
  }

  useEffect(() => {
    if (state.data) {
      const startingDate = new Date(state.data[0].date);
      startingDate.setHours(0, 0, 0, 0);

      const endingDate = new Date(state.data[state.data.length - 1].date);
      endingDate.setHours(0, 0, 0, 0);

      const diff = endingDate.getTime() - startingDate.getTime();
      const maxValueSlider = Math.floor(diff / (1000 * 60 * 60 * 24));
      setSliderValue([0, maxValueSlider]);
    }
  }, [state.data]);

  if (!state.data) {
    return (
      <div className="plot__container">
        <div className="main__plot">
          <p>Please Upload data</p>
        </div>
      </div>
    );
  }

  const startingDate = new Date(state.data[0].date);
  startingDate.setHours(0, 0, 0, 0);

  const endingDate = new Date(state.data[state.data.length - 1].date);
  endingDate.setHours(0, 0, 0, 0);

  const diff = endingDate.getTime() - startingDate.getTime();
  const maxValueSlider = Math.floor(diff / (1000 * 60 * 60 * 24));

  const filteredStartingDate = new Date(startingDate.getTime() + sliderValue[0] * (1000 * 60 * 60 * 24));
  const filteredEndingDate = new Date(startingDate.getTime() + (sliderValue[1] + 1) * (1000 * 60 * 60 * 24));

  const filteredData = state.data.filter((item) => {
    const date = new Date(item.date);
    return date >= filteredStartingDate && date <= filteredEndingDate;
  });

  const dateX = filteredData.map((item) => new Date(item.date));
  const pvPower = filteredData.map((item) => item.pvPower);
  const solarRadiation = filteredData.map((item) => item.solarRadiation);
  const time = filteredData.map((item) => item.time);
  const RH = filteredData.map((item) => item.RH);
  const Temperature = filteredData.map((item) => item.Temperature);
  const windSpeed = filteredData.map((item) => item.windSpeed);
  const DewPoint = filteredData.map((item) => item.DewPoint);
  const cloudCover = filteredData.map((item) => item.cloudCover);
  const Rainfall = filteredData.map((item) => item.Rainfall);

  const plotData = [
    {
      y: pvPower,
      x: filteredStartingDate === filteredEndingDate ? time : dateX,
      type: "scatter",
      mode: "lines",
      name: "PV",
      marker: {
        color: "blue",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      visible: pvPower[0] !== undefined,
      fill: "tozeroy", // Fill the area under the line graph
      fillcolor: "rgba(0, 0, 255, 0.1)", // Set the color and opacity of the filled area
    },
    {
      y: solarRadiation,
      x: filteredStartingDate === filteredEndingDate ? time : dateX,
      type: "scatter",
      mode: "lines",
      name: "Solar radiation",
      marker: {
        color: "red",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      visible: solarRadiation[0] !== undefined ? true : false,
      fill: "tozeroy",
      fillcolor: "rgba(255, 0, 0, 0.1)",
    },
    {
      y: RH,
      x: filteredStartingDate === filteredEndingDate ? time : dateX,
      type: "scatter",
      mode: "lines",
      name: "Relative Humidity",
      marker: {
        color: "pink",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      visible: RH[0] !== undefined ? true : false,
      fill: "tozeroy",
      fillcolor: "rgba(255, 0, 0, 0.1)",
    },
    {
      y: Temperature,
      x: filteredStartingDate === filteredEndingDate ? time : dateX,
      type: "scatter",
      mode: "lines",
      name: "Temperature",
      marker: {
        color: "green",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      visible: Temperature[0] !== undefined ? true : false,
      fill: "tozeroy",
      fillcolor: "rgba(0, 255, 0, 0.1)",
    },
    {
      y: windSpeed,
      x: filteredStartingDate === filteredEndingDate ? time : dateX,
      type: "scatter",
      mode: "lines",
      name: "Wind Speed",
      marker: {
        color: "pink",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      visible: windSpeed[0] !== undefined ? true : false,
      fill: "tozeroy",
      fillcolor: "rgba(255, 192, 203,0.3)",
    },
    {
      y: DewPoint,
      x: filteredStartingDate === filteredEndingDate ? time : dateX,
      type: "scatter",
      mode: "lines",
      marker: {
        color: "violet",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      name: "Dew Point",
      visible: DewPoint[0] !== undefined ? true : false,
      fill: "tozeroy",
      fillcolor: "rgba(143, 0, 255,0.2)",
    },
    {
      y: cloudCover,
      x: filteredStartingDate === filteredEndingDate ? time : dateX,
      type: "scatter",
      mode: "lines",
      marker: {
        color: "grey",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      name: "Cloud Cover",
      visible: cloudCover[0] !== undefined ? true : false,
      fill: "tozeroy",
      fillcolor: "rgba(0, 0, 0,0.2)",
    },
    {
      y: Rainfall,
      x: filteredStartingDate === filteredEndingDate ? time : dateX,
      type: "scatter",
      mode: "lines",
      marker: {
        color: "grey",
        line: {
          shape: "spline", // Apply spline interpolation for smoother curves
        },
      },
      name: "Rainfall",
      visible: Rainfall[0] !== undefined ? true : false,
      fill: "tozeroy",
      fillcolor: "rgba(0, 0, 0,0.2)",
    },
  ];

  const layout = {
    title: `Data from ${new Date(filteredStartingDate).toLocaleDateString("en-GB")} to ${new Date(
      filteredEndingDate
    ).toLocaleDateString("en-GB")}`,
    yaxis: {
      title: "Normalized Data",
      showgrid: false,
    },
    xaxis: {
      title: "Time (drag axis from side)",
      showgrid: false,
      showticklabels: true,
      type: "date",
    },
    autosize: true,
  };

  return (
    <div className="plot__container">
      <div className="main__header">
        <p className="dheader__greet" style={{ color: "#1f1914" }}>
          Welcome {user.username}
        </p>
      </div>
      <div className="main__plot">
        <Plot className="plot" data={plotData} config={{ responsive: true }} layout={layout} />

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
          <p style={{ color: "grey", margin: "auto" }}>{new Date(filteredStartingDate).toLocaleDateString("en-GB")}</p>
          <Slider
            value={sliderValue}
            min={0}
            max={maxValueSlider}
            onValueChange={handleSliderChange}
            defaultValue={[0, maxValueSlider]}
          />
          <p style={{ color: "grey", margin: "auto" }}>{new Date(filteredEndingDate).toLocaleDateString("en-GB")}</p>
        </div>
      </div>
    </div>
  );
}

export default Visualise;
