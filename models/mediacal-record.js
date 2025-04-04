const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicalSchema = new Schema(
  {
    pet_id: { type: String, required: true },
    allergies: { type: String },
    medical_condition: { type: String },
    medication: { type: String },
  },
  { collection: "medical_record" }
); // Explicitly set the collection name
module.exports = mongoose.model("Medical_record", medicalSchema);
