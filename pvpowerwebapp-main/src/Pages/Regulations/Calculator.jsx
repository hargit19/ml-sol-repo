import React, { useState } from "react";
import "../../css/Pages/Regulations/Calculation.css";

function Calculator() {
  const [penaltyError, setPenaltyError] = useState("");
  const [forecastPower, setForecastPower] = useState("");
  const [ppaValue, setPpaValue] = useState("");
  const [calculatedValue1, setCalculatedValue1] = useState("");
  const [calculatedValue2, setCalculatedValue2] = useState("");

  const handlePenaltyErrorChange = (event) => {
    setCalculatedValue1("");
    setPenaltyError(event.target.value);
  };

  const handleForecastPowerChange = (event) => {
    setCalculatedValue1("");
    setForecastPower(event.target.value);
  };
  
  const handleCalc1 = (e) => {
    e.preventDefault();
    if (!penaltyError || !forecastPower) return;
    
    const calculatedValue =
      Math.round(10000 * ((1 - forecastPower / 100) * 1.25 * (1 - penaltyError / 100) * (1 - penaltyError / 100))) /
      10000;
    setCalculatedValue1(calculatedValue);
  };
  
  const handleCalc2 = (e) => {
    e.preventDefault();
    if (!calculatedValue1 || !ppaValue) return;
    
    const calculatedValue = Math.round((100 * 100 * calculatedValue1) / ppaValue) / 100;
    setCalculatedValue2(calculatedValue);
  };

  const handlePpaValueChange = (event) => {
    setCalculatedValue2("");
    setPpaValue(event.target.value);
  };

  return (
    <div className="calculator__container">
      <h2>Cost of Penalties for Variable Renewable Power Forecasting</h2>
      
      <form>
        <div className="input-group">
          <div className="popular-badge">Expert Tool</div>
          <label htmlFor="penaltyError">Enter No Penalty Error Band (%)</label>
          <input 
            type="number" 
            id="penaltyError" 
            value={penaltyError} 
            onChange={handlePenaltyErrorChange} 
            placeholder="Enter percentage" 
            required 
          />
          <p className="info-text">
            For CERC regulation: <span className="highlight">15%</span> | 
            FOR regulation: <span className="highlight">10%</span> (new projects) and <span className="highlight">15%</span> (old projects) | 
            TNERC regulation: <span className="highlight">5%</span> for Solar and <span className="highlight">10%</span> for Wind
          </p>
        </div>

        <div className="input-group">
          <label htmlFor="forecastPower">
            Enter probability value that forecast power is inside No penalty error band (%)
          </label>
          <input 
            type="number" 
            id="forecastPower" 
            value={forecastPower} 
            onChange={handleForecastPowerChange} 
            placeholder="Enter percentage" 
            required 
          />
        </div>
        
        <button className="calculate-btn" onClick={handleCalc1}>Calculate Cost per Capacity</button>
        
        <div className="result-box">
          <p className="result-text">
            Approximate average cost per available capacity due to deviation charge: 
            <span className="highlight"> {calculatedValue1 ? `${calculatedValue1} INR/kW-Hr` : "—"}</span>
          </p>
          {!calculatedValue1 && (
            <p className="error-text">
              This needs to be calculated first before proceeding to the next step.
            </p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="ppaValue">
            Enter the PPA value of the project (INR/kW-Hr)
          </label>
          <input 
            type="number" 
            id="ppaValue" 
            value={ppaValue} 
            onChange={handlePpaValueChange} 
            placeholder="Enter PPA value" 
            required 
          />
        </div>
        
        <button className="calculate-btn" onClick={handleCalc2} disabled={!calculatedValue1}>
          Calculate Cost Percentage
        </button>
        
        <div className="result-box">
          <p className="result-text">
            Approximate Cost due to deviation charge w.r.t PPA: 
            <span className="highlight"> {calculatedValue2 ? `${calculatedValue2}%` : "—"}</span>
          </p>
        </div>
      </form>
      
      <p className="contact-info">
        For further details please contact at <span className="highlight">admin@ml-sol.com</span>
      </p>
    </div>
  );
}

export default Calculator;