import React, { Component } from "react";
import TopBar from "../shared/TopBar";
import BottomNavbar from "../shared/BottomNavbar";
import axios from "axios";
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap";

const item = window.localStorage.getItem("userData");
const user = JSON.parse(item)
export default class AddExercise extends Component {
  state = {
    startDate:
      new Date().toISOString().split("T")[0],
    startTime:
      new Date().toLocaleTimeString("en-US", { hour12: false }).substring(0, 5),
    name: this.props.location?.state?.element.name,
    intensityLevel: this.props.location?.state?.element.intensityLevel || 5,
    duration: this.props.location?.state?.element.duration,
    id: this.props.location?.state?.element.id,
    editing: this.props.location?.state?.editing,
    errors: {},
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  };

  handleValidation = () => {
    let duration = this.state.duration;
    let name = this.state.name;
    let errors = {};
    let formIsValid = true;

    if (!duration) {
      formIsValid = false;
      errors["duration"] = "Duration cannot be empty";
    }
    if (!name) {
      formIsValid = false;
      errors["name"] = "Name cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  };

  handleSubmit = (event) => {
    event?.preventDefault();

    if (this.handleValidation()) {
      const exerciseEntry = this.state;

      axios
        .post(
          `/exercise/user/${user.id}/day/${this.state.startDate}`,
          exerciseEntry
        )
        .then((res) => {
          this.props.history.push("/dashboard");
        })
        .catch((err) => console.log(err));
    }
  };

  handleDelete = (event) => {
    event?.preventDefault();

    const exerciseToDeleteId = this.state.id;

    axios
      .delete(
        `/exercise/user/${user.id}/day/${this.state.startDate}`,
        { params: exerciseToDeleteId }
      )
      .then((res) => {
        this.props.history.push("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  handleEditing = (event) => {
    event?.preventDefault();

    if (this.handleValidation()) {
      const updatedExercise = this.state;

      axios
        .put(
          `/exercise/user/${user.id}/day/${this.state.startDate}`,
          { data: updatedExercise }
        )
        .then((res) => {
          this.props.history.push("/dashboard");
        })
        .catch((err) => console.log(err));
    }
  };

  render() {
    const nameOptions = [
      "Choose an option",
      "Aerobics",
      "Baseball",
      "Boxing",
      "Climbing",
      "Cycling",
      "Dancing",
      "Diving",
      "Football",
      "Golf",
      "Hiking",
      "Hockey",
      "Martial Arts",
      "Rowing",
      "Rugby",
      "Running",
      "Skiing",
      "Softball",
      "Swimming",
      "Tennis",
      "Volleyball",
      "Walking",
      "Weights",
      "Yoga",
      "Other",
    ];

    return (
      <>
      <TopBar icon="Exercise" title="Exercise"/>
      <BottomNavbar/>
        <Row className='match-height'>
          <Col sm='12' md='6'>
            <Card className="flex flex-column items-center">
              <CardHeader >
                <CardTitle class='bi bi-cup-straw' tag='h4'>Exercise</CardTitle>
              </CardHeader>
              <CardBody >
                <form
                  onSubmit={
                    this.state.editing ? this.handleEditing : this.handleSubmit
                  }
                  className="flex flex-column items-center"
                  action="POST"
                >
                  <label htmlFor="start-date" className="f6 mt3">
                    Date:
                  </label>
                  <input
                    onChange={this.handleChange}
                    value={this.state.startDate}
                    type="date"
                    id="start-date"
                    name="startDate"
                    className='form-control'
                  />

                  <label htmlFor="start-time" className="f6 mt3">
                    Time:
                  </label>
                  <input
                    onChange={this.handleChange}
                    value={this.state.startTime}
                    type="time"
                    id="start-date"
                    name="startTime"
                    className='form-control'
                  />

                  <label htmlFor="name" className="f6 mt3">
                    Name:
                  </label>
                  <select
                    name="name"
                    id="name"
                    onChange={this.handleChange}
                    value={this.state.name}
                    className="form-select"
                  >
                    {nameOptions.map((option) => {
                      return (
                        <option value={option} className="f6">
                          {option}
                        </option>
                      );
                    })}
                  </select>
                  <span style={{ color: "red" }}>{this.state.errors["name"]}</span>

                  <label htmlFor="intensityLevel" className=" f6 mt3">
                    Intensity:
                  </label>
                  <input
                    onChange={this.handleChange}
                    value={this.state.intensityLevel}
                    type="range"
                    name="intensityLevel"
                    min="1"
                    max="10"
                    className="mt1 mb3"
                  />

                  <div className="f6 mt2">
                    <label htmlFor="duration" className="f6 mt3">
                      Duration:{" "}
                    </label>
                    <input
                      onChange={this.handleChange}
                      value={this.state.duration}
                      type="number"
                      id="duration"
                      name="duration"
                      min="0"
                      max="24"
                      className='form-control'
                    />
                    <span> hrs</span>
                  </div>
                  <span style={{ color: "red" }}>
                    {this.state.errors["duration"]}
                  </span>
                  <br />
                  <button
                    type="submit"
                    className="btn btn-secondary"
                  >
                    Save
                  </button>
                  <br />
                </form>

                <button
                  onClick={() => this.handleDelete()}
                  className="btn btn-danger"
                >
                  Delete
                </button>


              </CardBody>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
