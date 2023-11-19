import express from 'express';
const router = express.Router();

import Day from "../models/Day.js"
import User from "../models/user.model.js";

router.post("/user/:id/day/:date", (req, res, next) => {
  Day.findOne({ $and: [{ owner: req.params.id }, { date: req.params.date }] })
    .then((day) => {
      const newExercise = {
        startTime: req.body.startTime,
        name: req.body.name,
        intensityLevel: req.body.intensityLevel,
        duration: req.body.duration,
      };
      if (day !== null) {
        Day.findByIdAndUpdate(
          day._id,
          { $push: { exercises: newExercise } },
          { new: true }
        )
          .then((updatedDay) => {
            res.status(204).json(updatedDay);
          })
          .catch((err) => {
            res.json(err);
          });
      } else {
        const newDay = {
          date: req.body.startDate,
          foods: [],
          drinks: [],
          supplements: [],
          medications: [],
          exercises: [newExercise],
          sleep: [],
          symptoms: [],
          energy: null,
          owner: req.params.id,
        };
        Day.create(newDay)
          .then((dbDay) => {
            User.findByIdAndUpdate(req.params.id, {
              $push: { days: dbDay._id },
            }).then((user) => {
              res.status(201).json(dbDay);
            });
          })
          .catch((err) => {
            res.json(err);
          });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put("/user/:id/day/:date", (req, res, next) => {
  Day.findOneAndUpdate(
    {
      $and: [{ owner: req.params.id }, { date: req.params.date }],
      "exercises._id": req.body.data.id,
    },
    {
      $set: {
        "exercises.$.startTime": req.body.data.startTime,
        "exercises.$.name": req.body.data.name,
        "exercises.$.intensityLevel": req.body.data.intensityLevel,
        "exercises.$.duration": req.body.data.duration,
      },
    },
    { new: true }
  )
    .then((updatedDay) => {
      res.status(201).json(updatedDay);
    })
    .catch((err) => res.json(err));
});

router.delete("/user/:id/day/:date", (req, res, next) => {
  Day.findOneAndUpdate(
    {
      $and: [{ owner: req.params.id }, { date: req.params.date }],
      "exercises._id": req.query["0"],
    },
    { $pull: { exercises: { _id: req.query["0"] } } },
    { new: true }
  )
    .then((updatedDay) => {
      res.status(201).json(updatedDay);
    })
    .catch((err) => res.json(err));
});


export default router;
