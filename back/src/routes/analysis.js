import express from 'express';
const router = express.Router();

import Day from "../models/Day.js"

const getOutcomeData = async (owner, event) => {
  try {
    let outcomeData = { name: "", data: {} };

    if (event === "Energy") {
      outcomeData["name"] = "Energy";
      const daysWithEnergy = await Day.find({
        $and: [{ owner: owner }, { energy: { $exists: true } }],
      });
      daysWithEnergy.forEach((day) => {
        outcomeData["data"][day.date] = day.energy.energyLevel + "";
      });
    } else {
      outcomeData["name"] = event;
      const daysWithSymptom = await Day.find({
        $and: [{ owner: owner }, { "symptoms.name": event }],
      });
      daysWithSymptom.forEach((day) => {
        const symptom = day.symptoms.find((symptom) => symptom.name === event);
        outcomeData["data"][day.date] = symptom.intensity + "";
      });
    }
    return outcomeData;
  } catch (err) {
    return err;
  }
};

const getEventData = async (owner, event, specificEvent) => {
  try {
    let eventData = { name: event, data: {} };

    switch (event) {
      case "Sleep":
        const daysWithSleep = await Day.find({
          $and: [{ owner: owner }, { "sleep.duration": { $exists: true } }],
        });
        daysWithSleep.forEach((day) => {
          eventData["data"][day.date] = day.sleep[0].duration + "";
        });
        break;

      case "Foods":
        if (specificEvent.substring(0, 3) === "All") {
          const daysWithAnyFood = await Day.find({
            $and: [{ owner: owner }, { "foods.name": { $exists: true } }],
          });
          daysWithAnyFood.forEach((day) => {
            day.foods.forEach((food) => {
              !eventData["data"][day.date]
                ? (eventData["data"][day.date] = food.eatenPortion)
                : (eventData["data"][day.date] += food.eatenPortion);
            });
            eventData["data"][day.date] += "";
          });
        } else {
          eventData["name"] = specificEvent;
          const daysWithFood = await Day.find({
            $and: [{ owner: owner }, { "foods.name": specificEvent }],
          });
          daysWithFood.forEach((day) => {
            const food = day.foods.find((food) => food.name === specificEvent);
            eventData["data"][day.date] = food.eatenPortion + "";
          });
        }
        break;

      case "Drinks":
        if (specificEvent.substring(0, 3) === "All") {
          const daysWithAnyDrink = await Day.find({
            $and: [{ owner: owner }, { "drinks.name": { $exists: true } }],
          });
          daysWithAnyDrink.forEach((day) => {
            day.drinks.forEach((drink) => {
              !eventData["data"][day.date]
                ? (eventData["data"][day.date] = drink.servingAmount)
                : (eventData["data"][day.date] += drink.servingAmount);
            });
            eventData["data"][day.date] += "";
          });
        } else {
          eventData["name"] = specificEvent;
          const daysWithDrink = await Day.find({
            $and: [{ owner: owner }, { "drinks.name": specificEvent }],
          });
          daysWithDrink.forEach((day) => {
            const drink = day.drinks.find(
              (drink) => drink.name === specificEvent
            );
            eventData["data"][day.date] = drink.servingAmount + "";
          });
        }
        break;

      case "Exercise":
        if (specificEvent.substring(0, 3) === "All") {
          const daysWithAnyExercise = await Day.find({
            $and: [{ owner: owner }, { "exercises.name": { $exists: true } }],
          });
          daysWithAnyExercise.forEach((day) => {
            day.exercises.forEach((exercise) => {
              !eventData["data"][day.date]
                ? (eventData["data"][day.date] = exercise.duration)
                : (eventData["data"][day.date] += exercise.duration);
            });
            eventData["data"][day.date] += "";
          });
        } else {
          eventData["name"] = specificEvent;
          const daysWithExercise = await Day.find({
            $and: [{ owner: owner }, { "exercises.name": specificEvent }],
          });
          daysWithExercise.forEach((day) => {
            const exercise = day.exercises.find(
              (exercise) => exercise.name === specificEvent
            );
            eventData["data"][day.date] = exercise.duration + "";
          });
        }
        break;

      default:
    }

    return eventData;
  } catch (err) {
    return err;
  }
};

router.get("/user/:id/options", (req, res, next) => {
  Day.find({ owner: req.params.id })
    .then((days) => {
      const userOutcomes = [];

      const daysWithSymptoms = days.filter((day) => day.symptoms.length > 0);

      if (daysWithSymptoms.length > 0) {
        daysWithSymptoms.forEach((day) =>
          day.symptoms.forEach((symptom) => {
            if (!userOutcomes.includes(symptom.name))
              userOutcomes.push(symptom.name);
          })
        );
      }

      userOutcomes.sort().unshift("Select");

      const daysWithEnergy = days.filter(
        (day) => typeof day.energy.energyLevel === "number"
      );

      if (daysWithEnergy.length > 0) {
        userOutcomes.splice(1, 0, "Energy");
      }

      const userEvents = [];

      const userExercises = [];
      const daysWithExercises = days.filter((day) => day.exercises.length > 0);
      if (daysWithExercises.length > 0) {
        userEvents.push("Exercise");

        daysWithExercises.forEach((day) =>
          day.exercises.forEach((exercise) => {
            if (!userExercises.includes(exercise.name))
              userExercises.push(exercise.name);
          })
        );

        userExercises.sort().unshift("Select", "All exercises");
      }

      const daysWithSleep = days.filter((day) => day.sleep.length > 0);

      if (daysWithSleep.length > 0) {
        userEvents.push("Sleep");
      }

      const userFoods = [];
      const userIngredients = [];
      const daysWithFoods = days.filter((day) => day.foods.length > 0);

      if (daysWithFoods.length > 0) {
        userEvents.push("Foods");

        daysWithFoods.forEach((day) =>
          day.foods.forEach((food) => {
            if (!userFoods.includes(food.name)) {
              userFoods.push(food.name);
              //         food.ingredients.forEach(
              //           ingredient=>{
              //             if(!userIngredients.includes(ingredient.name))
              //               userIngredients.push(ingredient.name);
              //           }
              //         )
            }
          })
        );

        userFoods.sort().unshift("Select", "All Foods");
      }

      const userDrinks = [];
      const daysWithDrinks = days.filter((day) => day.drinks.length > 0);

      if (daysWithDrinks.length > 0) {
        userEvents.push("Drinks");

        daysWithDrinks.forEach((day) =>
          day.drinks.forEach((drink) => {
            if (!userDrinks.includes(drink.name)) {
              userDrinks.push(drink.name);
              //         food.ingredients.forEach(
              //           ingredient=>{
              //             if(!userIngredients.includes(ingredient.name))
              //               userIngredients.push(ingredient.name);
              //           }
              //         )
            }
          })
        );
        userDrinks.sort().unshift("Select", "All Drinks");
      }

      userEvents.sort().unshift("Select");

      res.json({
        userOutcomes: userOutcomes,
        userEvents: userEvents,
        Exercise: userExercises,
        Foods: userFoods,
        Drinks: userDrinks,
      });
    })
    .catch((err) => res.json(err));
});

router.get(
  "/user/:id/selected-data/:outcome/:event/:specificEvent",
  async (req, res, next) => {
    const dataArr = [];
    try {
      dataArr[0] = await getOutcomeData(req.params.id, req.params.outcome);
      dataArr[1] = await getEventData(
        req.params.id,
        req.params.event,
        req.params.specificEvent
      );
      res.json(dataArr);
    } catch (err) {
      res.json(err);
    }
  }
);

export default router;
