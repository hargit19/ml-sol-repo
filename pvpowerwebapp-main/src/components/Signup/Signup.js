import React, { useReducer } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendVerificationEmailFlow, signupFlow } from "../../api/authenticationFlow.js";
import "../../css/Signup/Signup.css";
import { initialState, reducer } from "../../reducer/SignupReducer";
import InputFieldWithLabel from "../InputComponent.js";
import Agreement from "./Agreement";

function Signup() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  async function handleRegisterUser(event) {
    event.preventDefault();
    const { name, email, username, address, phone, password, passwordConfirm, agreementCheck } = state;
    if (password !== passwordConfirm) {
      return toast.error("Password and Confirm Password do not match. ");
    }

    if (!agreementCheck) {
      return toast.error("Please accept the Terms and Services to proceed.");
    }

    const result = await signupFlow({ name, email, username, address, phone, password, passwordConfirm });

    if (result.status === "success") {
      toast.success("User registered successfully");
      await sendVerificationEmailFlow(email);
      navigate(`/verify-email/${email}`);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }

  function handleCloseAgreementModal() {
    dispatch({ type: "SET_SHOW_AGREEMENT", payload: false });
  }

  return (
    <div className="form__container">
      <Link to="/" className="back-to-home">
        <FaArrowLeft />
      </Link>
      <form className="form" onSubmit={handleRegisterUser}>
        <p className="signup__title">SIGN UP</p>

        {/* Form fields in a grid layout */}
        <div className="form__fields">
          <InputFieldWithLabel
            type={"text"}
            field={"Name"}
            value={state.name}
            handleOnChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value.trim() })}
          />

          <InputFieldWithLabel
            type={"text"}
            field={"Username"}
            value={state.username}
            handleOnChange={(e) => dispatch({ type: "SET_USERNAME", payload: e.target.value.trim() })}
          />

          <InputFieldWithLabel
            type="email"
            field="Email"
            value={state.email}
            handleOnChange={(event) => dispatch({ type: "SET_EMAIL", payload: event.target.value.trim() })}
          />

          <InputFieldWithLabel
            type="tel"
            field="Phone Number"
            value={state.phone}
            handleOnChange={(event) => {
              const numiricalValueOnly = event.target.value.replace(/[^0-9]/g, "");
              dispatch({ type: "SET_PHONE", payload: numiricalValueOnly });
            }}
          />

          <InputFieldWithLabel
            type="password"
            field="Password"
            value={state.password}
            handleOnChange={(event) => {
              dispatch({ type: "SET_PASS", payload: event.target.value.trim() });
            }}
          />

          <InputFieldWithLabel
            type="password"
            field="Confirm Password"
            value={state.passwordConfirm}
            handleOnChange={(event) => {
              dispatch({ type: "SET_CONFIRM_PASS", payload: event.target.value.trim() });
            }}
          />

          <InputFieldWithLabel
            type="text"
            field="Billing Address"
            value={state.address}
            handleOnChange={(event) => {
              dispatch({ type: "SET_ADDRESS", payload: event.target.value });
            }}
          />
        </div>

        {/* Error messages */}
        {!state.isValid && state.password && (
          <div className="error">
            Password must be at least 8 characters long and contain at least one digit, one letter, and one special
            character.
          </div>
        )}

        {state.passwordConfirm && state.password !== state.passwordConfirm && (
          <div className="error">Password and Confirm Password do not match.</div>
        )}

        {/* Checkbox for terms and agreement */}
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="terms"
            checked={state.agreementCheck}
            onChange={(e) => dispatch({ type: "SET_AGREEMENT_CHECK" })}
          />
          <label 
            htmlFor="terms" 
            className={state.agreementCheck ? "checkbox-label" : ""}
            onClick={() => dispatch({ type: "SET_SHOW_AGREEMENT", payload: true })}
          >
            I accept Terms and services
          </label>
        </div>

        {/* Submit button and login link */}
        <button className="signup__btn" type="submit" disabled={!state.isValid}>
          Submit
        </button>
        
        <Link to={"/login"} className="forgotP">
          Already a member? Login
        </Link>
      </form>

      <Agreement open={state.showAgreement} closeModal={handleCloseAgreementModal} />
    </div>
  );
}

export default Signup;