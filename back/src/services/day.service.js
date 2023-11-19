import Day from "../models/Day.js"

const getDayByOwnerIdAndDate = (ownerId, date) => {
  return Day.findOne({ $and: [{ owner: ownerId }, { date: date }] })
    .populate({
      path: "foods",
      populate: {
        path: "ingredients",
        model: "Ingredient",
      },
    });
};

const getDaysByOwnerId = (ownerId) => {
  return Day.find({ owner: ownerId })
    .populate({
      path: "foods",
      populate: {
        path: "ingredients",
        model: "Ingredient",
      },
    });
};

export default {
  getDayByOwnerIdAndDate,
  getDaysByOwnerId
}