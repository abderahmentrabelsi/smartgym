import Exercise from "../models/exercise.model.js";

export const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.status(200).json(exercises);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }

};
