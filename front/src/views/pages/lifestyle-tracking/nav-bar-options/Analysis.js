import React, { Component } from "react";
import TopBar from "../shared/TopBar";
import BottomNavbar from "../shared/BottomNavbar";
import axios from "axios";
import { LineChart } from 'react-chartkick';
import 'chart.js';



const item = window.localStorage.getItem("userData");
const user = JSON.parse(item)
console.log(user)

export default class Analysis extends Component {
  state = {
    userOutcomes: [],
    selectedOutcome: "",
    userEvents: [],
    selectedEvent: "",
    userSpecificEvents: [],
    selectedSpecificEvent: "",
    selectedData: [],
  };


  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });

    this.getUserOptions();
  };

  getUserOptions = () => {
    axios
      .get(`/analysis/user/${user?.id}/options`)
      .then((res) => {
        this.setState({
          userOutcomes: [...res.data.userOutcomes],
          userEvents: [...res.data.userEvents],
        });

        if (this.state.selectedEvent && this.state.selectedEvent !== "Sleep") {
          this.setState({
            userSpecificEvents: [...res.data[this.state.selectedEvent]],
          });
        }

        this.getSelectedData();
      })
      .catch((err) => console.log(err));
  };

  getSelectedData = () => {
    axios
      .get(
        `/analysis/user/${user.id}/selected-data/${this.state.selectedOutcome
        }/${this.state.selectedEvent}/${this.state.selectedEvent === "Sleep"
          ? "Sleep"
          : this.state.selectedSpecificEvent
        }`
      )
      .then((res) => {
        if (typeof res.data !== "string") {
          this.setState({
            selectedData: [...res.data],
          });
        } else {
          this.setState({
            selectedData: [],
          });
        }
      })
      .catch((err) => console.log(err));
  };

  componentDidMount = () => {
    this.getUserOptions();
  };

  render() {
    let chartTitle;
    let yTitle;

    if (this.state.selectedOutcome === "Energy") {
      chartTitle = "Energy Level & ";
      yTitle = "Energy Level";
    } else {
      chartTitle = this.state.selectedOutcome + " & ";
      yTitle = "Symptom Intensity";
    }

    chartTitle += this.state.selectedSpecificEvent;
    let specificEventType = "";

    switch (this.state.selectedEvent) {
      case "Foods":
        specificEventType = "food";
        yTitle += " / Food Portions";
        break;

      case "Drinks":
        specificEventType = "drink";
        yTitle += " / Drink Portions";
        break;

      case "Exercise":
        specificEventType = "exercise";
        yTitle += " / Duration";
        break;

      default:
        chartTitle = chartTitle.split("&")[0] + "& Sleep";
        yTitle += " / Duration";
    }

    return (
      <div>
        <TopBar icon="analysis" title="Analysis" />

        <BottomNavbar />
        <div className="container pt-3 pb-5">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group d-flex align-items-center">
                <label htmlFor="selectedOutcome" className="f6 w-25 text-gray">
                  Outcome:
                </label>
                <select
                  className="form-select"
                  name="selectedOutcome"
                  id="selectedOutcome"
                  onChange={this.handleChange}
                  value={this.state.selectedOutcome}
                >
                  {this.state.userOutcomes.map((option) => {
                    return (
                      <option value={option} className="f6">
                        {option}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group d-flex align-items-center">
                <label htmlFor="selectedEvent" className="f6 w-25 text-gray">
                  Event:
                </label>
                <select
                  className="form-select"
                  name="selectedEvent"
                  id="selectedEvent"
                  onChange={this.handleChange}
                  value={this.state.selectedEvent}
                >
                  {this.state.userEvents.map((option) => {
                    return (
                      <option value={option} className="f6">
                        {option}
                      </option>
                    );
                  })}
                </select>
              </div>

              {this.state.selectedEvent === "Sleep" ||
                this.state.selectedEvent === "Select" ||
                !this.state.selectedEvent ? (
                <></>
              ) : (
                <div className="form-group d-flex align-items-center">
                  <label htmlFor="selectedSpecificEvent" className="f6 w-25 text-gray">
                    Select {specificEventType}:
                  </label>
                  <select
                    className="form-select"
                    name="selectedSpecificEvent"
                    id="selectedSpecificEvent"
                    onChange={this.handleChange}
                    value={this.state.selectedSpecificEvent}
                  >
                    {this.state.userSpecificEvents.map((option) => {
                      return (
                        <option value={option} className="f6">
                          {option}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {this.state.selectedData.length === 0 ||
                this.state.selectedOutcome === "Select" ||
                this.state.selectedEvent === "Select" ||
                this.state.selectedSpecificEvent === "Select" ? (
                <></>
              ) : (
                <div>
                  <h3 className="pt-1">{chartTitle}</h3>
                  <LineChart
                    data={this.state.selectedData}
                    xtitle="Time"
                    ytitle={yTitle}
                    height="50vh"
                    legend="bottom"
                  />
                </div>
              )}
            </div>

            
          </div>
        </div>
      </div>
    );
  }
}
