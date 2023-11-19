import React, { useState } from "react";
import axios from "axios";
import DrinkIngrForm from "./DrinkIngrForm";
import TopBar from "../../shared/TopBar";
import BottomNavbar from "../../shared/BottomNavbar";
import DateTimeInput from "../helper-components/DateTimeInput";


const item = window.localStorage.getItem("userData");
const user = JSON.parse(item)

const DrinkEdit = (props) => {
  const [state, setState] = useState({
    user: props.user,
    date: new Date().toISOString().split("T")[0],
    startTime:
      new Date().toLocaleTimeString("en-US", { hour12: false }).substring(0, 5),
    drink: props.location?.state.element,
    drinkId: props.location?.state.element.id,
    name: props.location?.state.element.name,
    category: props.location?.state.element.category,
    servingAmount: props.location?.state.element.servingAmount,
    servingSize: props.location?.state.element.servingSize,
    drinks: [],
    query: "",
    apiCategory: "",
    editing: true,
    errors: {},
  });

  const handleDeleteDrink = (event) => {
    event?.preventDefault();
    const drinkId = event.target.getAttribute("data-key");
    axios
      .put(
        `/drinks/user/${user.id}/day/${state.date}/${drinkId}/delete`
      )
      .then((res) => {
        props.history.push("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDrinkValidation = () => {
    let name = state.name;
    let servingAmount = state.servingAmount;
    let errors = {};
    let formIsValid = true;

    if (!name) {
      formIsValid = false;
      errors["name"] = "Drink name cannot be empty";
    }
    if (!servingAmount) {
      formIsValid = false;
      errors["servingAmount"] = "Serving amount cannot be empty";
    }
    setState((prevState) => ({
      ...prevState,
      errors: errors,
    }));
    return formIsValid;
  };

  const handleEditDrink = (event) => {
    event.preventDefault();
    if (handleDrinkValidation()) {
      setState((prevState) => ({
        ...prevState,
        drink: {
          ...prevState.drink,
          name: state.name,
          category: state.category,
          servingAmount: state.servingAmount,
          servingSize: state.servingSize,
          startTime: state.startTime,
        },
      }));
      const payload = {
        user: state.user,
        date: state.date,
        drink: state.drink,
      };
      axios
        .put(
          `/drinks/user/${user.id}/day/${state.date}/${state.drinkId}/edit`,
          payload
        )
        .then(() => {
          props.history.push("/dashboard");
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <TopBar title="Drinks" icon="Drinks" />
      <div className="pt3 pb6">
        <DateTimeInput
          date={state.date}
          startTime={state.startTime}
          handleChange={handleChange}
        />
        <div className="mw6 center">
          <h3 className="f6 db">What did you drink?</h3>
          <DrinkIngrForm
            {...state}
            handleChange={handleChange}
            handleDeleteDrink={handleDeleteDrink}
            handleEditDrink={handleEditDrink} />
        </div>
      </div>
    </div>
  );
};
export default DrinkEdit;