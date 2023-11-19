import React from "react";
import { Link } from "react-router-dom";
import Icons from "../shared/Icons";

export default function DashboardCard(props) {
  function returnCard(
    element,
    icon,
    title,
    subtitle,
    subtitleValue,
    path,
    specificName
  ) {
    return (
      <div className="card border-light-blue rounded mb-2">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div className="rounded-circle border p-2 mr-2">
            <Icons icon={icon} />
          </div>
          <div className="text-left">
            <p className="font-weight-bold text-gray mb-1">{title}</p>
            {!specificName ? (
              <></>
            ) : (
              <p className="text-gray font-italic mb-0">{specificName}</p>
            )}
            {!subtitle ? (
              <></>
            ) : (
              <p className="text-gray mb-0">
                {subtitle}: {subtitleValue}
              </p>
            )}
          </div>
        </div>
        <Link
          to={{
            pathname: path,
            state: { element: element, editing: true, day: props.day },
          }}
          className="text-decoration-none text-blue d-inline-block ml-3"
        >
          <Icons icon="Edit" />
        </Link>
      </div>
      </div>
    );
  }

  switch (props.entryType) {
    case "energy":
      return returnCard(
        props.energy,
        "Energy3",
        "Energy",
        "Energy level",
        props.energy.energyLevel,
        "/pages/add/Energy"
      );

    case "exercise":
      return props.exercises.map((exercise) =>
        returnCard(
          exercise,
          "Exercise3",
          "Exercise",
          "Intensity",
          exercise.intensityLevel,
          "/pages/add/Exercise",
          exercise.name
        )
      );

    case "symptom":
      return props.symptoms.map((symptom) =>
        returnCard(
          symptom,
          "Symptoms3",
          "Symptom",
          "Intensity",
          symptom.intensity,
          "/pages/add/Symptoms",
          symptom.name
        )
      );

    case "sleep":
      return props.sleep.map((sleep) =>
        returnCard(
          sleep,
          "Sleep3",
          "Sleep",
          "Duration",
          sleep.duration,
          "/pages/add/Sleep"
        )
      );

    case "food":
      return props.foods.map((food) =>
        returnCard(
          food,
          "Foods3",
          "Foods",
          "Portions",
          food.eatenPortion,
          "/pages/edit/Foods",
          food.name
        )
      );

    case "drink":
      return props.drinks.map((drink) =>
        returnCard(
          drink,
          "Drinks3",
          "Drinks",
          "Portions",
          drink.servingAmount,
          "/pages/edit/Drinks",
          drink.name
        )
      );

    default:
  }
}
