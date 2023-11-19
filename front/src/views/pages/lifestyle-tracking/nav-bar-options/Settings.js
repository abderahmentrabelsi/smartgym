import React from "react";
import { logout } from "../../services/auth";
import { Link } from "react-router-dom";
import TopBar from "../shared/TopBar";
import BottomNavbar from "../shared/BottomNavbar";
import Icons from "../shared/Icons";
import axios from "axios";

export default class Settings extends React.Component {
  state = {
    newEmail: "",
    newPassword: "",
    updateMessage: "",
    errMessage: "",
    showForm: true,
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event?.preventDefault();

    const { newEmail, newPassword } = this.state;

    axios
      .put(`/api/users/${this.props.user._id}`, {
        data: [newEmail, newPassword],
      })
      .then((res) => {
        this.setState({
          updateMessage: res.data.message,
          showForm: false,
        });
      })
      .catch((err) => console.log(err));
  };

  handleLogout = () => {
    logout().then(() => {
      this.props.setUser(null);
    });
  };

  render() {
    return (
      <div>
        <TopBar icon="settings" title="Settings" />
        <div className="pt3 pb5">
          {this.state.showForm && (
            <form
              onSubmit={this.handleSubmit}
              className="flex flex-column items-center"
              action="POST"
            >
              <label className="f6 mt3" htmlFor="new-email">
                New email:
              </label>
              <input
                className="mb2"
                id="new-email"
                name="newEmail"
                onChange={this.handleChange}
                value={this.state.newEmail}
                type="email"
                required
              />
              <label className="f6 mt3" htmlFor="newPassword">
                New password:
              </label>
              <input
                className="mb2"
                id="new-password"
                name="newPassword"
                onChange={this.handleChange}
                value={this.state.newPassword}
                type="password"
                minLength="8"
                maxLength="20"
                required
              />
              <button
                className="f6 w4 dim ph3 pv2 mt3 dib white bg-dark-green br-pill b--dark-green"
                type="submit"
              >
                Update
              </button>
            </form>
          )}
          {this.state.updateMessage && (
            <div className="flex flex-column items-center justify-center pa5">
              <h3 className="f5 f4-m f3-l fw2 black-80 mt0">
                {this.state.updateMessage}
              </h3>
              <span>Your account: {this.state.newEmail}</span>
            </div>
          )}
          <Link to="/" onClick={() => this.handleLogout()}>
            <div className="blue pt5">
              <Icons icon="logout" />
            </div>
            <p className="f6 w4 dim ph3 pv2 mt3 dib white bg-dark-blue br-pill b--dark-blue">
              Logout
            </p>
          </Link>
        </div>
        <BottomNavbar />
      </div>
    );
  }
}
