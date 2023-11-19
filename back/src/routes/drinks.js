import express from 'express';
const router = express.Router();
import Day from "../models/Day.js"
import User from "../models/user.model.js";

router.post("/user/:id/day/:date", (req, res) => {
  const {
    date,
    startTime,
    name,
    category,
    servingAmount,
    servingSize,
    imgUrl
  } = req.body;
  Day.findOne({
    $and: [{ owner: req.params.id }, { date: req.params.date }],
  }).then((day) => {
    if (day !== null) {
      Day.findByIdAndUpdate(
        day._id,
        {
          $push: {
            drinks: {
              startTime,
              name,
              category,
              imgUrl,
              servingAmount,
              servingSize,
            },
          },
        },
        { new: true }
      )
        .then((dbDay) => {
          res.status(201).json(dbDay);
        })
        .catch((err) => {
          res.json(err);
        });
    } else {
      Day.create({
        date: date,
        owner: req.params.id,
        drinks: [
          {
            startTime,
            name,
            imgUrl,
            category,
            servingAmount,
            servingSize,
          },
        ],
      }).then((dbDay) => {
        User.findByIdAndUpdate(req.params.id, {
          $push: { days: dbDay._id },
        })
          .then((dbUser) => {
            res.status(201).json(dbUser);
          })
          .catch((err) => {
            res.json(err);
          });
      });
    }
  });
});

// delete drink

router.put("/user/:userId/day/:date/:drinkId/delete", (req, res, next) => {
  Day.findOne({
    $and: [{ owner: req.params.userId }, { date: req.params.date }],
  })
    .then((dbDay) => {
      const newDrinks = dbDay.drinks.filter(
        (drink) => drink.id !== req.params.drinkId
      );
      Day.findOneAndUpdate(
        { $and: [{ owner: req.params.userId }, { date: req.params.date }] },
        { drinks: newDrinks },
        { new: true }
      )
        .then(() => {
          res.status(200).json({ message: "ok" });
        })
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});

// edit drink
router.put("/user/:userId/day/:date/:drinkId/edit", (req, res, next) => {
  const drink = req.body.drink;
  Day.findOne({
    $and: [{ owner: req.params.userId }, { date: req.params.date }],
  }).then((dbDay) => {
    const newDrinks = dbDay.drinks;
    const changedIdx = newDrinks.findIndex(
      (drink) => drink.id == req.params.drinkId
    );
    newDrinks[changedIdx].startTime = drink.startTime;
    newDrinks[changedIdx].name = drink.name;
    newDrinks[changedIdx].category = drink.category;
    newDrinks[changedIdx].servingAmount = drink.servingAmount;
    newDrinks[changedIdx].servingSize = drink.servingSize;
    Day.findOneAndUpdate(
      { $and: [{ owner: req.params.userId }, { date: req.params.date }] },
      { drinks: newDrinks },
      { new: true }
    )
      .then(() => {
        res.status(200).json({ message: "ok" });
      })
      .catch((err) => res.json(err));
  });
});

export default router;
