import React, { Component } from "react";
import axios from "axios";
import BottomNavbar from "../shared/BottomNavbar";
import TopBar from "../shared/TopBar";
import DataList from "../add-entries/helper-components/DataList";
import DateTimeInput from "../add-entries/helper-components/DateTimeInput";
import Icons from "../shared/Icons";


const item = window.localStorage.getItem("userData");
const user = JSON.parse(item)

export default class Recipes extends Component {
  state = {
    date:
       new Date().toISOString().split("T")[0],
    startTime:
      
      new Date().toLocaleTimeString("en-US", { hour12: false }).substring(0, 5),
    user: user.id,
    foods: [],
    isDayEmpty: "",
  };

  getUserData() {
    axios
      .get(`/days/user/${user.id}`)
      .then((res) => {
        if (res.data === null) {
          this.setState({
            isDayEmpty: true,
          });
        } else {
          this.setState({
            foods: this.flattenDays(res.data),
          });
        }
      })
      .catch((err) => console.log(err));
  }

  flattenDays = (days) => {
    let foods = [];
    const foodsArr = days.map((day) => day.foods);
    for (let i = 0; i < foodsArr.length; i++) {
      foods = foods.concat(foodsArr[i]);
    }
    const foodCounts = {};
    for (let i = 0; i < foods.length; i++) {
      if (foodCounts.hasOwnProperty(foods[i].name)) {
        foodCounts[foods[i].name].count += 1;
      } else {
        foodCounts[foods[i].name] = { ...foods[i], count: 1 };
      }
    }
    return Object.values(foodCounts);
  };

  componentDidMount() {
    this.getUserData();
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "date") {
      this.setState({
        date: value,
      });
    } else if (name === "startTime") {
      this.setState({
        tempStartTime: value,
      });
    }
  };

  handleClick = (event) => {
    event.preventDefault();
    const key = event.target.getAttribute("data-key");
    const clickedRecipe = this.state.foods.find((food) => food._id === key);
    const payload = {
      user: this.state.user,
      date: this.state.date,
      food: { ...clickedRecipe, startTime: this.state.startTime },
    };
    axios
      .post(
        `/api/ingredients/user/${user.id}/day/${this.state.date}`,
        payload
      )
      .then(() => {
        this.props.history.push("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div>
        {this.state.isDayEmpty && (
          <div>
            <TopBar title="Your Recipes" icon="recipes" />
            <BottomNavbar />
            <h3>You haven't added any recipes yet 🙃 </h3>
            
          </div>
        )}

        <TopBar title="Your Recipes" icon="recipes" />
        <BottomNavbar />
        <div className="pt3 pb6">
          <h3>
            <Icons icon="frequent" />
            Recipes from the last days...
          </h3>
          <p>👇 Add me to your diary agian! </p>
          <DateTimeInput
            date={this.state.date}
            startTime={this.state.startTime}
            handleChange={this.handleChange}
          />
          <DataList
            data={this.state.foods.map((food) => {
              return {
                ...food,
                count: `You ate this recipe ${food.count} times`,
              };
            })}
            img="imgUrl"
            heading="name"
            subtitle="count"
            key="_id"
            dataKey="_id"
            handleClick={this.handleClick}
          />
        </div>
      </div>
    );
  }
}
