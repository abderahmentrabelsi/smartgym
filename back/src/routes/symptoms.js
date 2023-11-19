import express from 'express';
const router = express.Router();

import Day from "../models/Day.js"
import User from "../models/user.model.js";

router.post("/user/:id/day/:date", (req, res, next) => {
  Day.findOne({ $and: [{ owner: req.params.id }, { date: req.params.date }] })
    .then((day) => {
      const newSymptom = {
        name: req.body.name,
        startTime: req.body.startTime,
        intensity: req.body.intensity,
        notes: req.body.notes,
      };

      if (day !== null) {
        Day.findByIdAndUpdate(
          day._id,
          { $push: { symptoms: newSymptom } },
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
          exercises: [],
          sleep: [],
          symptoms: [newSymptom],
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
      "symptoms._id": req.body.data.id,
    },
    {
      $set: {
        "symptoms.$.startTime": req.body.data.startTime,
        "symptoms.$.name": req.body.data.name,
        "symptoms.$.intensity": req.body.data.intensity,
        "symptoms.$.notes": req.body.data.notes,
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
      "symptoms._id": req.query["0"],
    },
    { $pull: { symptoms: { _id: req.query["0"] } } },
    { new: true }
  )
    .then((updatedDay) => {
      res.status(201).json(updatedDay);
    })
    .catch((err) => res.json(err));
});

export default router;
