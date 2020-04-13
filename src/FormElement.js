import React from "react";

const FormElement = ({ label, forId, children }) => (
  <div className="form-element">
    <label htmlFor={forId}>{label}</label>
    <div>{children}</div>
  </div>
);

export default FormElement;
