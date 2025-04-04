const Symtom = require("../models/symtom");
const Pet = require("../models/pet");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const createSymtom = async (req, res, next) => {
  const errors = validationResult(req);
  console.log("Incoming request body:", req.body);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(" Invalid inputs passed, please check your data.", 422)
    );
  }

  const { pet_id, symtoms, days, SeverityLevel } = req.body;
  console.log(pet_id);
  let pets;
  try {
    pets = await Pet.findById(pet_id);
    console.log(pets);
    if (!pets) {
      return next(new HttpError("No pet found, please try again.", 404));
    }
    const createdSymtom = new Symtom({
      pet_id,
      symtoms,
      days,
      SeverityLevel,
    });
    pets.reminders = 1;
    await pets.save();
    await createdSymtom.save();
  } catch (err) {
    const error = new HttpError("Fetching pets failed, please try again.", 500);
    return next(error);
  }

  res.status(200).json({ symtoms });
};

const updateSymtom = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(" Invalid inputs passed, please check your data.", 422)
    );
  }
  const petId = req.params.petId;
  const { symtoms, days, SeverityLevel } = req.body;

  let symtom;
  try {
    symtom = await Symtom.findOne({ pet_id: petId });
  } catch (err) {
    const error = new HttpError(
      "Fetching symtom failed, please try again.",
      500
    );
    return next(error);
  }
  if (!symtom) {
    return next(
      new HttpError("Could not find symtom with the provided ID.", 404)
    );
  }
  symtom.symtoms = symtoms;
  symtom.days = days;
  symtom.SeverityLevel = SeverityLevel;
  try {
    await symtom.save();
  } catch (err) {
    return next(
      new HttpError("Updating symtom failed, please try again.", 500)
    );
  }
  res.status(200).json({ message: "Pet updated successfully", pet });
};

exports.createSymtom = createSymtom;
exports.updateSymtom = updateSymtom;
