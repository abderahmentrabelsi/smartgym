import React, { useState, useEffect } from "react";
import TopBar from "../shared/TopBar";
import BottomNavbar from "../shared/BottomNavbar";
import axios from "axios";
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap";


const item = window.localStorage.getItem("userData");
const user = JSON.parse(item)

const AddEnergy = (props) => {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState(

    new Date()
      .toLocaleTimeString("en-US", { hour12: false })
      .substring(0, 5)
  );
  const [energyLevel, setEnergyLevel] = useState(
    props.location?.state?.element.energyLevel || 5
  );
  const [editing, setEditing] = useState(props.location?.state?.editing);

  useEffect(() => {
    if (props.location?.state) {
      setStartDate(props.location?.state.day);
      setStartTime(props.location?.state.element.startTime);
      setEnergyLevel(props.location?.state.element.energyLevel);
      setEditing(props.location?.state.editing);
    }
  }, [props.location?.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "startDate":
        setStartDate(value);
        break;
      case "startTime":
        setStartTime(value);
        break;
      case "energyLevel":
        setEnergyLevel(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event?.preventDefault();

    const energyEntry = { startDate, startTime, energyLevel };

    axios
      .post(`/energy/user/${user.id}/day/${startDate}`, energyEntry)
      .then((res) => {
        props.history.push("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (event) => {
    event?.preventDefault();

    axios
      .delete(`/energy/user/${user.id}/day/${startDate}`)
      .then((res) => {
        props.history.push("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  const handleEditing = (event) => {
    event?.preventDefault();

    const updatedEnergy = { startDate, startTime, energyLevel };

    axios
      .put(`/energy/user/${user.id}/day/${startDate}`, {
        data: updatedEnergy,
      })
      .then((res) => {
        props.history.push("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
    <TopBar icon="Energy" title="Energy"/>
    <BottomNavbar />
      <Row className='match-height'>
        <Col sm='12' md='6'>
          <Card className="flex flex-column items-center">
            <CardHeader >
              <CardTitle class='bi bi-cup-straw' tag='h4'>Exercise</CardTitle>
            </CardHeader>
            <CardBody >
              <form
                onSubmit={editing ? handleEditing : handleSubmit}
                className="flex flex-column items-center"
                action="POST"
              >
                <label htmlFor="start-date" className="f6 mt3">
                  Date:
                </label>
                <input
                  onChange={handleChange}
                  value={startDate}
                  type="date"
                  id="start-date"
                  name="startDate"
                  className='form-control'
                />

                <label htmlFor="start-time" className="f6 mt3">
                  Time:
                </label>
                <input
                  onChange={handleChange}
                  value={startTime}
                  type="time"
                  id="start-date"
                  name="startTime"
                  className='form-control'
                />

                <label htmlFor="energyLevel" className=" f6 mt3">
                  Energy Level:
                </label>
                <input
                  onChange={handleChange}
                  value={energyLevel}
                  type="range"
                  name="energyLevel"
                  min="1"
                  max="10"
                  className='form-control'
                />

                <button
                  type="submit"
                  className="f6 w4 dim ph3 pv2 mt3 dib white bg-dark-blue br-pill b--dark-blue"
                >
                  Save
                </button>
              </form>

              <button
                onClick={() => handleDelete()}
                className="f6 w4 dim ph3 pv2 mt3 dib white bg-dark-red br-pill b--dark-red"
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
export default AddEnergy;
