import React from "react";
import Icons from "./Icons";

export default function TopBar(props) {
  return (
    <nav className="navbar navbar-expand-lg  ">
      <div className="container">
        <a className="navbar-brand" href="/">
          <div className="border border-white rounded-circle p-1 d-inline-flex align-items-center mr-2">
            <Icons icon={props.icon} />
          </div>
          <span className="text-white font-weight-bold">{props.title}</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {/*adding element */ }
        </div>
      </div>
    </nav>
  );
}
