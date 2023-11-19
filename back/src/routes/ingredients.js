import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

import Day from "../models/Day.js"
import User from "../models/user.model.js";
import Ingredient from "../models/Ingredient.js";

// get all the Ingredients
router.get("/", (req, res, next) => {
  Ingredient.find()
    .populate("owner")
    .then((ingredients) => {
      res.status(200).json(ingredients);
    })
    .catch((err) => {
      res.json(err);
    });
});

// create a single food Ingredient
router.post("/user/:id/day/:date", (req, res) => {
  const { user, date, food } = req.body;
  const ingredients = food.ingredients.map((ing) => {
    return {
      name: ing.name,
      brand: ing.brand,
      category: ing.category,
      servingAmount: ing.servingAmount,
      servingSize: ing.servingSize,
      imgUrl: ing.imgUrl,
      owner: req.params.id,
    };
  });
  Day.findOne({
    $and: [{ owner: req.params.id }, { date: req.params.date }],
  }).then((day) => {
    if (day !== null) {
      Ingredient.create(ingredients).then((dbIngredients) => {
        Day.findByIdAndUpdate(
          day._id,
          {
            $push: {
              foods: {
                startTime: food.startTime,
                name: food.name,
                portion: food.portion,
                eatenPortion: food.eatenPortion,
                imgUrl: food.imgUrl,
                ingredients: dbIngredients,
              },
            },
          },
          { new: true }
        )
          .then((dbIngredients) => {
            res.status(201).json(dbIngredients);
          })
          .catch((err) => {
            res.json(err);
          });
      });
    } else {
      Ingredient.create(ingredients)
        .then((dbIngredients) => {
          Day.create({
            date: date,
            owner: req.params.id,
            foods: [
              {
                startTime: food.startTime,
                name: food.name,
                portion: food.portion,
                eatenPortion: food.eatenPortion,
                imgUrl: food.imgUrl,
                ingredients: dbIngredients,
              },
            ],
            drinks: [],
            supplements: [],
            medications: [],
            exercises: [],
            sleep: [],
            symptoms: [],
            energy: "",
          }).then((dbDay) => {
            User.findByIdAndUpdate(req.params.id, {
              $push: { days: dbDay._id },
            });
          });
        })
        .then((dbIngredient) => {
          res.status(201).json(dbIngredient);
        })
        .catch((err) => {
          res.json(err);
        });
    }
  });
});

// add a recipe
router.post("/recipe/user/:id/day/:date", (req, res) => {
  const {
    recipeName,
    date,
    startTime,
    name,
    brand,
    category,
    servingAmount,
    servingSize,
    portion,
    eatenPortion,
    imgUrl
  } = req.body;
  Day.findOne({
    $and: [{ owner: req.params.id }, { date: req.params.date }],
  }).then((day) => {
    if (day !== null) {
      Ingredient.create({
        name,
        brand,
        category,
        servingAmount,
        servingSize,
        imgUrl,
        owner: req.params.id,
      }).then((dbIngredient) => {
        Day.findByIdAndUpdate(
          day._id,
          {
            $push: {
              foods: {
                startTime: startTime,
                name: recipeName,
                portion: portion,
                eatenPortion: eatenPortion,
                imgUrl: imgUrl,
                ingredients: dbIngredient,
              },
            },
          },
          { new: true }
        )
          .then((dbIngredient) => {
            res.status(201).json(dbIngredient);
          })
          .catch((err) => {
            res.json(err);
          });
      });
    } else {
      Ingredient.create({
        name: name,
        brand: brand,
        category: category,
        servingAmount: servingAmount,
        servingSize: servingSize,
        imgUrl: imgUrl,
        owner: req.params.id,
      })
        .then((dbIngredient) => {
          Day.create({
            date: date,
            owner: req.params.id,
            foods: [
              {
                startTime: startTime,
                imgUrl: imgUrl,
                name: recipeName,
                portion: portion,
                eatenPortion: eatenPortion,
                ingredients: [dbIngredient],
              },
            ],
            drinks: [],
            supplements: [],
            medications: [],
            exercises: [],
            sleep: [],
            symptoms: [],
            energy: "",
          }).then((dbDay) => {
            User.findByIdAndUpdate(req.params.id, {
              $push: { days: dbDay._id },
            });
          });
        })
        .then((dbIngredient) => {
          res.status(201).json(dbIngredient);
        })
        .catch((err) => {
          res.json(err);
        });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Ingredient.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({ message: "ok" });
    })
    .catch((err) => {
      res.json(err);
    });
});

// delete food

router.put("/user/:userId/day/:date/:foodId/delete", (req, res, next) => {
  Day.findOne({
    $and: [{ owner: req.params.userId }, { date: req.params.date }],
  }).then((dbDay) => {
    const newFoods = dbDay.foods.filter((food) => {
      food.id !== req.params.foodId;
    });
    Day.findOneAndUpdate(
      { $and: [{ owner: req.params.userId }, { date: req.params.date }] },
      { foods: newFoods }
    )
      .then(() => {
        res.status(200).json({ message: "ok" });
      })
      .catch((err) => {
        res.json(err);
      });
  });
});

// edit a food

router.put("/user/:userId/day/:date/:foodId/edit", (req, res) => {
  const food = req.body.food;
  const ingredients = req.body.food.ingredients.map((ing) => {
    return {
      name: ing.name,
      brand: ing.brand,
      category: ing.category,
      servingAmount: ing.servingAmount,
      servingSize: ing.servingSize,
      owner: req.params.id,
    };
  });
  Ingredient.create(ingredients).then((dbIngredients) => {
    Day.findOne({
      $and: [{ owner: req.params.userId }, { date: req.params.date }],
    }).then((dbday) => {
      const newFoods = dbday.foods;
      const changedIdx = newFoods.findIndex(
        (food) => food.id == req.params.foodId
      );
      newFoods[changedIdx].ingredients = dbIngredients.map((ing) => ing._id);
      newFoods[changedIdx].name = food.name;
      newFoods[changedIdx].portion = food.portion;
      newFoods[changedIdx].eatenPortion = food.eatenPortion;
      Day.findByIdAndUpdate(dbday._id, { foods: newFoods }, { new: true })
        .then((dbIngredients) => {
          res.status(201).json(dbIngredients);
          res.redirect("/add/Foods");
        })
        .catch((err) => {
          res.json(err);
        });
    });
  });
});

export default router;
