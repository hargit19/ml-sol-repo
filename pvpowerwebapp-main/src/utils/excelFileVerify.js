import moment from "moment";
import Papa from "papaparse";
import * as XLSX from "xlsx";

function ExcelDateToJSDate(serial) {
  var utc_days = Math.floor(serial - 25569);

  if (isNaN(utc_days)) {
    const dateString = moment(serial, [
      "DD-MM-YYYY hh:mm",
      "YYYY-MM-DD hh:mm",
      "MM-DD-YYYY hh:mm",
      "YYYY-DD-MM hh:mm",
      "DD/MM/YYYY hh:mm",
      "DD-MM-YYYY hh:mm",
      "DD-MM-YYYY hh:mm",
      "DD-MM-YYYY hh:mm",
    ]).format("YYYY-MM-DD HH:mm:ss");

    return dateString;
  }

  var utc_value = utc_days * 86400;
  var date_info = new Date(utc_value * 1000);

  var fractional_day = serial - Math.floor(serial) + 0.0000001;
  var total_seconds = Math.floor(86400 * fractional_day);
  var seconds = total_seconds % 60;
  total_seconds -= seconds;
  var hours = Math.floor(total_seconds / (60 * 60));
  var minutes = Math.floor(total_seconds / 60) % 60;

  const convertedDate = new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );

  var year = convertedDate.getFullYear();
  var month = (convertedDate.getMonth() + 1).toString().padStart(2, "0");
  var day = convertedDate.getDate().toString().padStart(2, "0");
  hours = convertedDate.getHours().toString().padStart(2, "0");
  minutes = convertedDate.getMinutes().toString().padStart(2, "0");
  seconds = convertedDate.getSeconds().toString().padStart(2, "0");

  const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return dateString;
}

async function getDataFile(file, state) {
  const allowedFormats = [
    "application/wps-office.xlsx",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

  if (!allowedFormats.includes(file.type)) {
    return { status: "error", message: "Invalid file format." };
  }

  const dateIndex = state.columnHeaders.date.charCodeAt(0) - 65;
  const timeIndex = state.columnHeaders.time ? state.columnHeaders.time.charCodeAt(0) - 65 : null;
  const windSpeedIndex = state.columnHeaders.windSpeed ? state.columnHeaders.windSpeed.charCodeAt(0) - 65 : null;
  const airTempIndex = state.columnHeaders.airTemp ? state.columnHeaders.airTemp.charCodeAt(0) - 65 : null;
  const RHIndex = state.columnHeaders.RH ? state.columnHeaders.RH.charCodeAt(0) - 65 : null;
  const solarRadiationIndex = state.columnHeaders.solarRadiation
    ? state.columnHeaders.solarRadiation.charCodeAt(0) - 65
    : null;
  const passiveCloudCoverIndex = state.columnHeaders.passiveCloudCover
    ? state.columnHeaders.passiveCloudCover.charCodeAt(0) - 65
    : null;
  const dewPtTempIndex = state.columnHeaders.dewPtTemp ? state.columnHeaders.dewPtTemp.charCodeAt(0) - 65 : null;
  const rainfallIndex = state.columnHeaders.rainfall ? state.columnHeaders.rainfall.charCodeAt(0) - 65 : null;
  const pvPowerIndex = state.columnHeaders.pvPower ? state.columnHeaders.pvPower.charCodeAt(0) - 65 : null;

  if (file.type === "text/csv") {
    const promise = new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const dataArray = results.data;
          const keys = Object.keys(dataArray[0]);
          const newData = dataArray.map((row) => {
            const newRow = {};
            newRow.date = ExcelDateToJSDate(row[keys[dateIndex]]);
            newRow.time = timeIndex ? row[keys[timeIndex]] : undefined;
            newRow.windSpeed = windSpeedIndex ? parseFloat(row[keys[windSpeedIndex]]) : undefined;
            newRow.Temperature = airTempIndex ? parseFloat(row[keys[airTempIndex]]) : undefined;
            newRow.RH = RHIndex ? parseFloat(row[keys[RHIndex]]) : undefined;
            newRow.cloudCover = passiveCloudCoverIndex ? parseFloat(row[keys[passiveCloudCoverIndex]]) : undefined;
            newRow.DewPoint = dewPtTempIndex ? parseFloat(row[keys[dewPtTempIndex]]) : undefined;
            newRow.Rainfall = rainfallIndex ? parseFloat(row[keys[rainfallIndex]]) : undefined;
            newRow.solarRadiation = solarRadiationIndex ? parseFloat(row[keys[solarRadiationIndex]]) : undefined;
            newRow.pvPower = pvPowerIndex ? parseFloat(row[keys[pvPowerIndex]]) : undefined;
            return newRow;
          });
          resolve({ status: "success", message: "File uploaded successfully", data: newData });
        },
        error: function (error) {
          reject(error);
        },
      });
    });
    return promise;
  }

  const reader = new FileReader();
  var newData = [];
  const promise = new Promise((resolve, reject) => {
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const dataArray = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      dataArray.splice(0, state.dataStartRow - 1);
      newData = dataArray.map((row) => {
        const newRow = {};
        newRow.date = ExcelDateToJSDate(row[dateIndex]);
        newRow.time = timeIndex ? row[timeIndex] : undefined;
        newRow.windSpeed = windSpeedIndex ? row[windSpeedIndex] : undefined;
        newRow.Temperature = airTempIndex ? row[airTempIndex] : undefined;
        newRow.RH = RHIndex ? row[RHIndex] : undefined;
        newRow.cloudCover = passiveCloudCoverIndex ? row[passiveCloudCoverIndex] : undefined;
        newRow.DewPoint = dewPtTempIndex ? row[dewPtTempIndex] : undefined;
        newRow.Rainfall = rainfallIndex ? row[rainfallIndex] : undefined;
        newRow.solarRadiation = solarRadiationIndex ? row[solarRadiationIndex] : undefined;
        newRow.pvPower = pvPowerIndex ? row[pvPowerIndex] : undefined;
        return newRow;
      });
      resolve({ status: "success", message: "File uploaded successfully", data: newData });
    };
    reader.onerror = (error) => reject(error);
  });

  reader.readAsArrayBuffer(file);

  return promise;
}

export default getDataFile;
