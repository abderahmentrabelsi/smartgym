import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const daySchema = new Schema(
  {
    date: {
      type: String,
    },

    owner: { type: Schema.Types.ObjectId, ref: "user" },

    foods: [
      {
        startTime: String,
        name: String,
        imgUrl: String,
        portion: Number,
        eatenPortion: Number,
        ingredients: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }],
      },
    ],

    drinks: [
      {
        startTime: String,
        name: String,
        imgUrl: String,
        category: {
          type: String,
          enum: ["Alcoholic", "Non-alcoholic", "Ordinary drink", "Cocktail"],
        },
        servingAmount: Number,
        servingSize: String,
      },
    ],

    exercises: [
      {
        name: String,
        startTime: String,
        duration: Number,
        intensityLevel: Number,
      },
    ],

    sleep: [
      {
        startTime: String,
        duration: Number,
        notes: String,
      },
    ],

    symptoms: [
      {
        name: String,
        startTime: String,
        duration: Number,
        intensity: Number,
        notes: String,
      },
    ],

    energy: {
      startTime: String,
      energyLevel: Number,
    },
  },

  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Day = mongoose.model("Day", daySchema);
export default Day;
