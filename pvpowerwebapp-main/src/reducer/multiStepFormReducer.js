const initalState = {
  isDateTimeSameColumn: false,
  dateFormat: "",
  mode: "",
  columnHeaders: {
    date: "",
    time: "",
    airTemp: "",
    windSpeed: "",
    RH: "",
    solarRadiation: "",
    passiveCloudCover: "",
    dewPtTemp: "",
    rainfall: "",
    pvPower: "",
  },
  dataStartRow: 1,
  data: null,
  validationData: null,
  state: null,
};

function formReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_DATE_TIME_SAME_COLUMN":
      return { ...state, isDateTimeSameColumn: !state.isDateTimeSameColumn };
    case "SET_DATE_FORMAT":
      return { ...state, dateFormat: action.payload };
    case "SET_RADIO_VALUE":
      return { ...state, mode: action.payload };
    case "SET_COLUMN":
      return {
        ...state,
        columnHeaders: {
          ...state.columnHeaders,
          ...action.payload,
        },
      };
    case "SET_DATA_START_ROW":
      return { ...state, dataStartRow: action.payload };
    case "USE_SAVED_HEADERS":
      return action.payload;
    case "SET_DATA":
      return { ...state, data: action.payload };
    case "SET_VALIDATION_DATA":
      return { ...state, validationData: action.payload };
    case "SET_SELECTED_STATE":
      return { ...state, state: action.payload };
    default:
      break;
  }
}

export { formReducer, initalState };
