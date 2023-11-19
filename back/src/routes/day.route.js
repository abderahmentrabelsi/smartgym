import express from 'express'
const router = express.Router();

import dayController from "../controllers/day.controller.js"

router.get("/user/:id/day/:date/", dayController.getDayByOwnerIdAndDate);

router.get("/user/:id", dayController.getDaysByOwnerId);

export default router;