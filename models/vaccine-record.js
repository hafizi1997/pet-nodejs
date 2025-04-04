const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vaccineSchema = new Schema(
  {
    pet_id: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
    vaccine_type: { type: String },
    date: { type: String },
  },
  { collection: "vaccine_record" }
); // set the collection name
module.exports = mongoose.model("Vaccine_record", vaccineSchema);
