import React, { Component } from "react";
import BottomNavbar from "../shared/BottomNavbar";
import EntryList from "../shared/EntryList";
import Calendar from "../shared/Calendar";


/*const item = window.localStorage.getItem("userData");
const user = JSON.parse(item)
console.log(user);
*/
export default class AddItem extends Component {
  render() {
    const eventArr = ["Drinks", "Foods", "Sleep", "Exercise"];
    const outcomeArr = ["Symptoms", "Energy"];

    return (
      <div className="flex flex-column justify-center items-center ">
        <div className="w-100">
          <Calendar />
        </div>
        <BottomNavbar />
        <div className="flex justify-center pv5">
          <EntryList title="Events" entries={eventArr} />
          <EntryList title="Outcomes" entries={outcomeArr} />
        </div>

        
      </div>
    );
  }
}
