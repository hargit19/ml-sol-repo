import React from "react";
import { useRouteError } from "react-router-dom";
import "../css/Pages/Error.css";

function Error() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="error__container">
      <p className="error__heading" style={{ color: "black" }}>
        OOPs!
      </p>
      <p className="error__subheading" style={{ color: "black" }}>
        An Error occured
      </p>
      <p className="error__info" style={{ color: "black" }}>
        {error.statusText || error.message}
      </p>
    </div>
  );
}

export { Error };
