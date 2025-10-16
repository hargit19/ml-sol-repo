import { useState } from "react";

function CalcError() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null; // nothing rendered at all

  return (
    <div className="sbmt-modal-parent">
      <div className="sbmt-modal-childs">
        <p
          style={{
            marginBottom: "5px",
            fontSize: "22px",
            fontWeight: "550",
          }}
          className="calculating"
        >
          An Error Occurred!
        </p>

        <p className="desc-txt">
          Date and time format does not match the required format. Please contact the admin at admin@ml-sol.com.
        </p>

        <div className="btns">
          <button className="cancel-sbmt" onClick={() => setVisible(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalcError;
