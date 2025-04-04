const { SeverityLevel } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const symtomSchema = new Schema(
  {
    pet_id: { type: String },
    symtoms: { type: String },
    days: { type: Number },
    SeverityLevel: { type: Number },
  },
  { collection: "symtom" }
); //  set the collection name
module.exports = mongoose.model("Symtom", symtomSchema);
