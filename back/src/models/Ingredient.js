import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ingredientSchema = new Schema(
  {
    name: String,
    brand: String,
    category: String,
    servingAmount: Number,
    servingSize: String,
    imgUrl: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },

  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;
