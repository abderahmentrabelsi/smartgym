import React from "react";
import { Input } from "reactstrap";

function FormRow(props) {
  return (
    <div>
      <label htmlFor={props.name || ""} className="f6 w3 dib">
        {props.title || ""}
      </label>
      <Input 
      type="email" id="basicInput" 
        placeholder={props.placeholder}
        name={props.name || ""}
        value={props.value || ""}
        onChange={(event) => props.handleChange(event)}
      />
    </div>
  );
}

function SelectRow(props) {
  return (
    <div>
      <label htmlFor={props.id} > {props.title || ""} </label>
      <select
        className='form-select'
        value={props.value || ""}
        id={props.id}
        name={props.name || ""}
        onChange={(event) => props.handleChange(event)}
      >
        {props.options.map((option) => {
          return (
            <option key={option} value={option}> {option} </option>
          );
        })}
      </select>
    </div>
  );
}

export { FormRow, SelectRow };
