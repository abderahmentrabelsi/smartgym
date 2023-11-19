import mongoose from "mongoose";

const exerciseSchema = mongoose.Schema({
  bodyPart: String,
  equipment: String,
  gifUrl: String,
  id: String,
  name: String,
  target: String,
});
const Exercise  = mongoose.model('Exercise', exerciseSchema);
export default Exercise;
