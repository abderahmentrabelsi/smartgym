import React from "react";
import { Link } from "react-router-dom";
import Icons from "./Icons";

export default function EntryList(props) {
  return (
    <div className="card border-light-blue rounded m-2">
      {props.title && (
        <h2 className="card-header text-gray">{props.title}</h2>
      )}
      <ul className="list-group list-group-flush">
        {props.entries.map((entry) => {
          return (
            <li className="list-group-item border-bottom">
              <Link
                className="d-flex align-items-center text-gray text-decoration-none"
                to={`/pages/add/${entry}`}
              >
                <div className="rounded-circle border p-1">
                  <Icons icon={entry} />
                </div>
                <span className="ml-3">{entry}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
