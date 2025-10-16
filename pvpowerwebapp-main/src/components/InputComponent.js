import React from "react";

function InputField({ type, value, placeholder, handleOnChange }) {
  function handleFocus(event) {
    event.target.parentNode.classList.add("focused");
  }

  function handleBlur(event) {
    if (!event.target.value) {
      event.target.parentNode.classList.remove("focused");
    }
  }

  return (
    <input
      type={type}
      value={value}
      onChange={handleOnChange}
      className="input"
      placeholder={placeholder ? placeholder : ""}
      onFocus={handleFocus}
      onBlur={handleBlur}
      required
    />
  );
}

function InputFieldWithLabel({ type, field, value, placeholder, setValue, handleOnChange }) {
  if (!handleOnChange) handleOnChange = (event) => setValue(event.target.value);

  return (
    <label className={value ? "focused" : ""}>
      <InputField type={type} value={value} placeholder={placeholder} handleOnChange={handleOnChange} />
      <span className="placeholder">{field}</span>
    </label>
  );
}

export default InputFieldWithLabel;
