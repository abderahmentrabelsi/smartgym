import React, { Component } from "react";

export default class Calendar extends Component {
  state = {
    day: new Date().toISOString().split("T")[0],
  };

  handleChange = (event) => {
    this.props.setDate(event.target.value);
    this.setState({
      day: event.target.value,
    });
  };

  handleArrowClick = (event) => {
    let newDate = new Date(this.state.day);

    if (event.target.id === "left-arrow")
      newDate.setDate(newDate.getDate() - 1);
    else newDate.setDate(newDate.getDate() + 1);

    this.setState({
      day: newDate.toISOString().split("T")[0],
    });

    this.props.setDate(newDate.toISOString().split("T")[0]);
  };

  render() {
    return (
      <div className="mb5">
        <nav className="fixed top-0 w-100 pa3 pa4-ns tc flex justify-center items-center bg-blue shadow-1">
          <a
            className="link dim gray f5 f5-ns dib mh2 white b"
            id="left-arrow"
            onClick={this.handleArrowClick}
          >
            {"<"}
          </a>
          <form className="link tc dim gray f6 f5-ns dib mh2">
            <input
              className="tr dark-gray"
              type="date"
              name="date"
              id="date"
              value={this.state.day}
              placeholder={this.state.day}
              onChange={this.handleChange}
            />
          </form>
          <a
            className="link tc dim gray f5 f5-ns dib mh2 white b"
            id="right-arrow"
            onClick={this.handleArrowClick}
          >
            {" "}
            {">"}{" "}
          </a>
        </nav>
      </div>
    );
  }
}
