import React, { Component } from "react";
import Icons from "../../shared/Icons";
import "../food/FoodEntry.css";

export default class DateTimeInput extends Component {
  render() {
    return (
      <>
        <form className="date-form">
          <div className="row-container">
            <Icons icon="date-picker" />
            <input
              type="date"
              id="date"
              className='form-control'
              name="date"
              value={this.props.date}
              onChange={this.props.handleChange}
            />
          </div>
          <div className="row-container">
            <Icons icon="time-picker" />
            <input
              type="time"
              id="startTime"
              className='form-control'
              name="startTime"
              value={this.props.startTime}
              onChange={this.props.handleChange}
            />
          </div>
        </form>
      </>
    );
  }
}
