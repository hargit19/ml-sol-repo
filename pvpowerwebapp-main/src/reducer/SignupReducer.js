const initialState = {
  name: "",
  email: "",
  username: "",
  address: "",
  phone: "",
  password: "",
  passwordConfirm: "",
  isValid: true,
  agreementCheck: false,
  showAgreement: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "SET_ADDRESS":
      return { ...state, address: action.payload };
    case "SET_PHONE":
      return { ...state, phone: action.payload };
    case "SET_PASS":
      const password = action.payload;
      const isValid =
        password.length >= 8 &&
        /[a-zA-Z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password);
      return { ...state, password, isValid };
    case "SET_CONFIRM_PASS":
      return { ...state, passwordConfirm: action.payload };
    case "SET_AGREEMENT_CHECK":
      return { ...state, agreementCheck: !state.agreementCheck };
    case "SET_SHOW_AGREEMENT":
      return { ...state, showAgreement: action.payload };

    default:
      return state;
  }
}

export { initialState, reducer };
