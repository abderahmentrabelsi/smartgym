import React, { Component } from "react";
import axios from "axios";

import TopBar from "../shared/TopBar";
import BottomNavbar from "../shared/BottomNavbar";
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap";

const item = window.localStorage.getItem("userData");
const user = JSON.parse(item)
export default class AddSymptoms extends Component {
  state = {
    startDate:
      this.props.location?.state?.day || new Date().toISOString().split("T")[0],
    startTime:
      this.props.location?.state?.element.startTime ||
      new Date().toLocaleTimeString("en-US", { hour12: false }).substring(0, 5),
    name: this.props.location?.state?.element.name,
    intensity: this.props.location?.state?.element.intensity || 5,
    notes: this.props.location?.state?.element.notes,
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
    let name = this.state.name;
    let errors = {};
    let formIsValid = true;

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
      const symptomEntry = this.state;

      axios
        .post(
          `/symptoms/user/${user.id}/day/${this.state.startDate}`,
          symptomEntry
        )
        // console.log(symptomEntry)
        .then((res) => {
          this.props.history.push("/dashboard");
        })
        .catch((err) => console.log(err));
    }
  };

  handleDelete = (event) => {
    event?.preventDefault();

    const symptomToDeleteId = this.state.id;

    axios
      .delete(
        `/symptoms/user/${user.id}/day/${this.state.startDate}`,
        { params: symptomToDeleteId }
      )
      .then((res) => {
        this.props.history.push("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  handleEditing = (event) => {
    event?.preventDefault();

    if (this.handleValidation()) {
      const updatedSymptom = this.state;

      axios
        .put(
          `/symptoms/user/${user.id}/day/${this.state.startDate}`,
          { data: updatedSymptom }
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
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Stomach pain",
      "Headache",
      "Bloating",
      "Eczema",
      "Hayfever",
      "Asthma",
      "Heartburn",
      "Gas",
      "Constipation",
      "Other",
    ];

    return (
      <>
      
      <TopBar icon="Symptoms" title="Symptoms"/>
      <BottomNavbar/>
      <Row className='match-height'>
        <Col sm='12' >
          <Card className="flex flex-column items-center">
            <CardHeader >
              <CardTitle class='bi bi-cup-straw' tag='h4'>Symptoms</CardTitle>
            </CardHeader>
            <CardBody >
              <form
                onSubmit={
                  this.state.editing ? this.handleEditing : this.handleSubmit
                }
                className="flex flex-column items-center"
                action="POST"
              >
                <label htmlFor="start-date" className="f6 mt3 blue">
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
                  className='form-select'
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

                <label htmlFor="intensity" className=" f6 mt3">
                  Intensity:
                </label>
                <input
                  onChange={this.handleChange}
                  value={this.state.intensity}
                  type="range"
                  name="intensity"
                  min="1"
                  max="10"
                  className='form-control'
                />

                <label htmlFor="notes" className="f6 mt3">
                  Notes:
                </label>
                <input
                  onChange={this.handleChange}
                  value={this.state.notes}
                  type="textarea"
                  id="notes"
                  name="notes"
                  className='form-control'
                />

                <button
                  type="submit"
                  className="btn btn-secondary "
                >
                  Save
                </button>
              </form>
              <button
                onClick={() => this.handleDelete()}
                className="btn btn-danger "
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
