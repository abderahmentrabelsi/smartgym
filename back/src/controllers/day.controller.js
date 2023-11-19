import dayService from "../services/day.service.js";

const getDayByOwnerIdAndDate = (req, res, next) => {
  const ownerId = req.params.id;
  const date = req.params.date;

  dayService.getDayByOwnerIdAndDate(ownerId, date)
    .then((day) => {
      res.json(day);
    })
    .catch((err) => console.log(err));
};

const getDaysByOwnerId = (req, res, next) => {
  const ownerId = req.params.id;

  dayService.getDaysByOwnerId(ownerId)
    .then((days) => {
      res.json(days);
    })
    .catch((err) => console.log(err));
};

export default {
  getDayByOwnerIdAndDate,
  getDaysByOwnerId
}