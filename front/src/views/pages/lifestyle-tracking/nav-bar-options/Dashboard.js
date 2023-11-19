import React, { useState, useEffect } from "react";
import DashboardCard from "../shared/DashboardCard";
import Calendar from "../shared/Calendar";
import BottomNavbar from "../shared/BottomNavbar";
import axios from "axios";

const Dashboard = ({ user }) => {
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);
  const [isDayEmpty, setIsDayEmpty] = useState(true);
  const [energy, setEnergy] = useState(undefined);
  const [foods, setFoods] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [sleep, setSleep] = useState([]);
  const [symptoms, setSymptoms] = useState([]);

  const setDate = async (date) => {
    await setDay(date);
    await getUserData();
  };

  const getUserData = () => {
    axios
      .get(`/days/user/${user.id}/day/${day}`)
      .then((res) => {
        console.log(res)
        if (res.data === null) {
          setIsDayEmpty(true);
        } else {
          setIsDayEmpty(false);
          setEnergy(res.data.energy);
          setFoods(res.data.foods);
          setDrinks(res.data.drinks);
          setExercises(res.data.exercises);
          setSleep(res.data.sleep);
          setSymptoms(res.data.symptoms);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUserData();
  }, []);

  let allDayEntries;

  if (!isDayEmpty) {
    allDayEntries = (
      <div>
        {!energy ? (
          <></>
        ) : (
          <DashboardCard
            entryType="energy"
            energy={energy}
            user={user.id}
            day={day}
          />
        )}
        {symptoms.length === 0 ? (
          <></>
        ) : (
          <DashboardCard
            entryType="symptom"
            symptoms={symptoms}
            user={user.id}
            day={day}
          />
        )}
        {foods.length === 0 ? (
          <></>
        ) : (
          <DashboardCard
            entryType="food"
            foods={foods}
            user={user.id}
            day={day}
          />
        )}
        {drinks.length === 0 ? (
          <></>
        ) : (
          <DashboardCard
            entryType="drink"
            drinks={drinks}
            user={user.id}
            day={day}
          />
        )}
        {exercises.length === 0 ? (
          <></>
        ) : (
          <DashboardCard
            entryType="exercise"
            exercises={exercises}
            user={user.id}
            day={day}
          />
        )}
        {sleep.length === 0 ? (
          <></>
        ) : (
          <DashboardCard
            entryType="sleep"
            sleep={sleep}
            user={user.id}
            day={day}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <BottomNavbar />
      <Calendar setDate={setDate} />
      <div className="flex flex-column items-center pv5">
        {isDayEmpty ? (
          <h1>No entries for this day!</h1>
        ) : (
          allDayEntries
        )}
      </div>
    </div>
  );
};

export default Dashboard;
