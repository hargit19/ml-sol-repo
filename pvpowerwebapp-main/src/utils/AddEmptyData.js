function updateTimeArray(arr) {
  const updatedTimeArray = [];

  const unshiftArr = [];
  const pushArr = [];

  for (let i = 0; i < parseInt(arr[0].split(":")[0]); i++) {
    unshiftArr.push(`${i}:00`);
  }

  for (let i = parseInt(arr[arr.length - 1].split(":")[0]) + 1; i < 24; i++) {
    pushArr.push(`${i}:00`);
  }

  updatedTimeArray.push(...unshiftArr, ...arr, ...pushArr);

  return updatedTimeArray;
}

function updateDataArray(arr, timeArray) {
  const updatedDataArray = [];
  const unshiftArr = [];
  const pushArr = [];

  for (let i = 0; i < parseInt(timeArray[0].split(":")[0]); i++) {
    unshiftArr.push(0);
  }

  for (let i = parseInt(timeArray[timeArray.length - 1].split(":")[0]) + 1; i < 24; i++) {
    pushArr.push(0);
  }

  updatedDataArray.push(...unshiftArr, ...arr, ...pushArr);

  return updatedDataArray;
}

export function addEmptyData(timeArray, quickPredictedData, premiumPredictedData) {
  const updatedTimeArray = updateTimeArray(timeArray);

  const updatedQuickPredictedData = updateDataArray(quickPredictedData, timeArray);
  const updatedPremiumPredictedData = updateDataArray(premiumPredictedData, timeArray);

  return { updatedTimeArray, updatedQuickPredictedData, updatedPremiumPredictedData };
}
