import { toast } from "react-toastify";
import { getDownloadExcelFileFlow } from "../api/predictedDataFlow";

export async function handleDownloadFile(username, date) {
  try {
    const downloadDate = new Date(date).toISOString();

    const response = await getDownloadExcelFileFlow(downloadDate);

    const blob = new Blob([response], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${username}_${new Date(date).toLocaleDateString("en-GB")}_MLSol_forecast.xlsx`;

    a.click();

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong. Please try again later.");
    return;
  }
}
