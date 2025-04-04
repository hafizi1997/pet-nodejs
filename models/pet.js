const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const petSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  breed: { type: String },
  reminders: { type: Number, enum: [0, 1], default: 0 },
  nextcheckup: { type: Date },
  age: { type: Number },
  weight: { type: Number },
  isactive: { type: Number, enum: [0, 1], default: 1 },
  healthrecord: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Healthrecord" },
  ],
});

petSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Pet", petSchema);
