import React, { Component } from "react";
import IngrForm from "./IngrForm";
import { FormRow } from "../helper-components/Rows";

export default class RepForm extends Component {
  capitalizeFirstLetter = (string) => {
    const splitStr = string.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  };

  render() {
    let editInterface;
    if (this.props.edit === true) {
      editInterface = (
        <IngrForm
          {...this.props}
          handleChange={this.props.handleChange}
          handleSubmit={this.props.handleSingleSubmit}
        />
      );
    } else {
      editInterface = <></>;
    }
    let addInterface;
    if (this.props.add === true) {
      addInterface = (
        <IngrForm
          {...this.props}
          handleChange={this.props.handleChange}
          handleSubmit={this.props.handleAddSubmit}
          handleEdit={this.props.handleEdit}
          addNewIngr={this.props.addNewIngr}
        />
      );
    } else {
      addInterface = <></>;
    }

    return (
      <div>
        {this.props.editing ? (
          <h3 className="f5 db">What did you eat? </h3>
        ) : (
          <h3 className="f5 db"> Add a recipe </h3>
        )}

        <form
          onSubmit={
            this.props.editing
              ? this.props.editRecipeSubmit
              : this.props.handleSubmit
          }
        >
          <FormRow
            value={this.capitalizeFirstLetter(this.props.food.name)}
            title={this.props.editing ? "Food Name: " : "Recipe Name: "}
            type="text"
            id="recipeName"
            name="recipeName"
            handleChange={this.props.handleChange}
          />
          <span style={{ color: "red" }}>{this.props.errors["name"]}</span>
          <FormRow
            value={this.props.food.portion}
            title="Yield"
            type="number"
            id="portion"
            name="portion"
            min="0"
            handleChange={this.props.handleChange}
          />
          <FormRow
            value={this.props.food.eatenPortion}
            title="Your Portion"
            type="number"
            id="eatenPortion"
            name="eatenPortion"
            min="0"
            handleChange={this.props.handleChange}
          />
          <span style={{ color: "red" }}>
            {this.props.errors["eatenPortion"]}
          </span>
        </form>

        <div style={{ padding: "20px 0 5px 0" }}>
          {this.props.food.ingredients.map((ingr, index) => {
            return (
              <div key={ingr.id}>
                <button
                  onClick={
                    this.props.editing ? this.props.toggleEditIngr : () => {}
                  }
                  key={ingr.id}
                  data-key={index}
                  className="f7 link dim br2 ph1 pv1 mb2 pa4 mr2 dib white bg-dark-green"
                >
                  {ingr.name}
                </button>
                {this.props.editing && (
                  <button
                    onClick={this.props.handleDeleteIngredient}
                    data-key={index}
                    className="f6 link dim br4 ph2 pv1 mb2 dib white bg-dark-pink"
                  >
                    {" "}
                    ✖️{" "}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {this.props.editing && (
          <button
            onClick={this.props.toggleAddIngr}
            className="f7 link dim br4 ba ph2 pv1 mb3 dib dark-green"
          >
            {" "}
            ➕ Add a new ingredient
          </button>
        )}
        {editInterface}
        {addInterface}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div>
            {this.props.editing && (
              <button
                onClick={this.props.handleDeleteFood}
                data-key={this.props.food.id}
                className="f6 link dim br-pill ba bw1 ph2 pv2 mb4 mr3 dib dark-blue"
              >
                ✖️ Delete Food
              </button>
            )}
          </div>
          <form
            onSubmit={
              this.props.editing
                ? this.props.editRecipeSubmit
                : this.props.handleSubmit
            }
          >
            <button className="btn btn-secondary">
              Save all
            </button>
          </form>
        </div>
      </div>
    );
  }
}
