import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllPredictedDataFlow } from "../../api/predictedDataFlow";
import { useAuth } from "../../context/AuthProvider";
import { addEmptyData } from "../../utils/AddEmptyData";
import { handleDownloadFile } from "../../utils/downloadFile";

function Forecast() {
  const [forecastedData, setForecastedData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const date = searchParams.get("date");

  const { user } = useAuth();

  useEffect(() => {
    async function getForecastedData() {
      const result = await getAllPredictedDataFlow();
      console.log("current result", result);
      if (result.status !== "success") {
        toast.error("Something went wrong. Please try again.");
        return;
      }
      const forecast = result.data.predictedData;

      if (forecast.length === 0) {
        return;
      }

      if (!date) {
        if (forecast[forecast.length - 1].premium.length === 0) {
          setDialogOpen(true);
        }

        setForecastedData(forecast[forecast.length - 1]);
      } else {
        const paramDate = new Date(date);
        const filteredData = forecast.find((item) => {
          const itemDate = new Date(item.date);
          // Compare the year, month, and day
          return (
            itemDate.getFullYear() === paramDate.getFullYear() &&
            itemDate.getMonth() === paramDate.getMonth() &&
            itemDate.getDate() === paramDate.getDate()
          );
        });

        setForecastedData(filteredData);
      }
    }
    getForecastedData();
  }, [date]);

  function handleClickDownload(dateDownload) {
    handleDownloadFile(user._id, dateDownload);
  }

  console.log("forecasted data", forecastedData);

  if (!forecastedData) {
    return (
      <div className="plot__container">
        <div className="main__header">
          <p className="dheader__greet" style={{ color: "#1f1914" }}>
            Welcome {user.username}
          </p>
        </div>
        <div className="main__plot">
          <p className="no-data-available">No Data Available</p>
        </div>
      </div>
    );
  }

  if (forecastedData.quick.length === 0) {
    return (
      <div className="plot__container">
        <div className="main__header">
          <p className="dheader__greet" style={{ color: "#1f1914" }}>
            Welcome {user.username}
          </p>
        </div>
        <div className="main__plot">
  <p className="no-data-available">
    Model is still running for the quick forecast. Please check back later.
  </p>
  <div className="rolling-loader"></div>
</div>

      </div>
    );
  }

  const premiumDataExist = forecastedData.premium.length > 0;

  const timeArray = forecastedData.quick.map((item) => item.time);
  const quickPredictedData = forecastedData.quick.map((item) => item.PredictedPV);
  const premiumPredictedData = premiumDataExist ? forecastedData.premium.map((item) => item.PredictedPV) : [];

  const { updatedTimeArray, updatedQuickPredictedData, updatedPremiumPredictedData } = addEmptyData(
    timeArray,
    quickPredictedData,
    premiumPredictedData
  );

  const plotData = [
    {
      y: updatedQuickPredictedData,
      x: updatedTimeArray,
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
      y: updatedPremiumPredictedData,
      x: updatedTimeArray,
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
  ];

  const endDate = forecastedData.quick[0].date;

  const layout = {
    title: `Forecasted Data for ${new Date(endDate).toLocaleDateString("en-GB")}`,
    yaxis: {
      title: "Normalized Data",
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

  const dateDownload = forecastedData.date;

  return (
    <>
      <div className="plot__container">
        <div className="main__header">
          <p className="dheader__greet" style={{ color: "#1f1914" }}>
            Welcome {user.username}
          </p>
        </div>
        <div className="main__plot">
          <Plot className="plot" data={plotData} config={{ responsive: true }} layout={layout} />
        </div>
        <Button onClick={() => handleClickDownload(dateDownload)} className="download-btn">
          Download Excel
        </Button>
      </div>
      <Dialog.Root open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <Dialog.Content width={"20vw"}>
          <Dialog.Title>Info</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Premium model is currently running for the data. Please check back later.
          </Dialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" onClick={() => setDialogOpen(false)}>
              OK
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

export default Forecast;
