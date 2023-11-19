import React, { Component } from "react";
import "../food/FoodEntry.css";

export default class SearchField extends Component {
  render() {
    return (
      <div className="search-bar">
        <form onSubmit={this.props.handleQuery}>
          <label id="search-label">
            <input
              className='form-control'
              id="input-style"
              type="search"
              name="query"
              placeholder={this.props.placeholder}
              value={this.props.query}
              onChange={this.props.handleSearch}
            />
          </label>
        </form>
      </div>
    );
  }
}
