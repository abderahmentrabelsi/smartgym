import React from "react";
import { FormRow, SelectRow } from "../helper-components/Rows";

const DrinkIngrForm = (props) => {
  const options = [
    "Alcoholic",
    "Non-Alcoholic",
    "Ordinary drink",
    "Cocktail",
  ];

  return (
    <div>
      <form>
        <FormRow
          value={props.name}
          title="Name: "
          type="text"
          id="name"
          placeholder="Water"
          name="name"
          handleChange={props.handleChange}
        />
        <br/>
        <span style={{ color: "red" }}>{props.errors["name"]}</span>
        <SelectRow
          className='form-select'
          options={options}
          title="Category: "
          id="category"
          name="category"
          handleChange={props.handleChange}
        />
        <br/>
        <FormRow
          value={props.servingAmount}
          title="QT: "
          type="number"
          id="servingAmount"
          placeholder="300"
          name="servingAmount"
          min="0"
          handleChange={props.handleChange}
        />
        <span style={{ color: "red" }}>{props.errors["servingAmount"]}</span>
        <FormRow
          value={props.servingSize}
          title="Unit: "
          type="text"
          id="servingSize"
          placeholder="ml"
          name="servingSize"
          handleChange={props.handleChange}
        />
      </form>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div>
          {props.editing && (
            <button
              onClick={props.handleDeleteDrink}
              data-key={props.drink._id}
              className="f6 link dim br-pill ba bw1 ph2 mt3 pv2 mb4 mr2 dib dark-blue"
            >
              ✖️ Delete Drink
            </button>
          )}
        </div>
        <form
          onSubmit={
            props.editing
              ? props.handleEditDrink
              : props.handleSubmit
          }
        >
          <br/>
          <button
            type="submit"
            className="btn btn-success"
          >
            {" "}
            Save Drinks
          </button>
        </form>
      </div>
    </div>
  );
};

export default DrinkIngrForm;
