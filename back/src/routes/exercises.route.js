import express from "express";
import {getExercises} from "../controllers/exercise.controller.js";

const router = express.Router();

router.get("/", getExercises);

export default router;

