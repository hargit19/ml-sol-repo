import React from "react";
import ReactDom from "react-dom";
import "../../css/Modal/ConfirmCancel.css";

function ConfirmCancel({ showCancelPlanModal, closeCancelPlanModal }) {
  if (!showCancelPlanModal) return null;
  return ReactDom.createPortal(
    <>
      <div className="cancel_wrapper" onClick={() => closeCancelPlanModal(false)}></div>
      <div className="cancel_container">
        <p className="cancelplan__title">Please Confirm Your Cancellation</p>
        <p>You will only be refunded if you cancel within 3 days of buying plan.</p>
        <div className="button-container">
          <button className="cancelplan-button cancel" onClick={() => closeCancelPlanModal(false)}>
            Cancel
          </button>
          <button className="cancelplan-button confirm" onClick={() => closeCancelPlanModal(true)}>
            Confirm
          </button>
        </div>
      </div>
    </>,
    document.getElementById("confirm-cancellation")
  );
}

export default ConfirmCancel;
