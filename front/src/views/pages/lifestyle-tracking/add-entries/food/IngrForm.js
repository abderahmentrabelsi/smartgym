import React, { Component } from "react";
import { FormRow } from "../helper-components/Rows";

export default class IngrForm extends Component {
  capitalizeFirstLetter = (string) => {
    const splitStr = string.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  };

  render() {
    return (
      <div >
        <h3 className="f6 db">Custom single ingredient</h3>
        <div>
          <form>
            <div className="custom-ingredient">
              <FormRow
                value={this.capitalizeFirstLetter(
                  this.props.tempIngredient.name
                )}
                title="Name: "
                type="text"
                id="name"
                placeholder="e.g. Apple"
                name="name"
                handleChange={this.props.handleChange}
              />
              <span style={{ color: "red" }}>{this.props.errors["name"]}</span>
              <FormRow
                value={this.props.tempIngredient.brand}
                title="Brand: "
                type="text"
                id="category"
                placeholder="e.g. Edeka"
                name="brand"
                handleChange={this.props.handleChange}
              />
              <FormRow
                value={this.props.tempIngredient.category}
                title="Category: "
                type="text"
                id="category"
                placeholder="e.g. Foods"
                name="category"
                handleChange={this.props.handleChange}
              />
              <FormRow
                value={this.props.tempIngredient.servingAmount}
                title="QT: "
                type="number"
                id="servingAmount"
                placeholder="e.g. 3"
                name="servingAmount"
                min="0"
                handleChange={this.props.handleChange}
              />
              <span style={{ color: "red" }}>
                {this.props.errors["servingAmount"]}
              </span>
              <FormRow
                value={this.props.tempIngredient.servingSize}
                title="Unit: "
                type="text"
                id="servingSize"
                placeholder="e.g. piece"
                name="servingSize"
                handleChange={this.props.handleChange}
              />
            </div>
          </form>
          {this.props.editing && this.props.add ? (
            <button
              onClick={this.props.addNewIngrSave}
              className="f7 link dim br4 ba ph2 pv1 mb4 dib dark-green mr2"
            >
              {" "}
              ✔️ Save Ingredient
            </button>
          ) : this.props.editing && this.props.edit ? (
            <button
              onClick={this.props.editIngrSave}
              className="f7 link dim br4 ba ph2 pv1 mb4 dib dark-green mr2"
            >
              {" "}
              ✔️ Save Ingredient
            </button>
          ) : (
            <form onSubmit={this.props.handleSubmit}>
              <br/>
              <div className="text-center">
              <button
                type="submit"
                className="btn btn-secondary" 
              >
                {" "}
                Save Ingredient
              </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
}
