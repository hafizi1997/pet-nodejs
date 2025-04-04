const Pet = require("../models/pet");
const Medical = require("../models/mediacal-record");
const Vaccine = require("../models/vaccine-record");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const createpet = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(" Invalid inputs passed, please check your data.", 422)
    );
  }
  const {
    name,
    type,
    age,
    weight,
    breed,
    isactive,
    allergies,
    medical_condition,
    medication,
  } = req.body;
  const createdPet = new Pet({
    name,
    type,
    age,
    weight,
    breed,
    reminders: 0,
    isactive: isactive ? isactive : 0,
    healthrecord: [],
  });

  try {
    await createdPet.save();
    const createdMedical = new Medical({
      pet_id: createdPet._id,
      allergies: allergies ? allergies : "",
      medical_condition: medical_condition ? medical_condition : "",
      medication: medication ? medication : "",
    });

    await createdMedical.save();
  } catch (err) {
    const error = new HttpError("Creating pet failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({
    message: "Pet was created successfully",
  });
};

const getAllPet = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  let pets;
  let health_records_count;
  try {
    // apply pagination (skip & limit)
    pets = await Pet.find({})
      // Sort by _id in descending order (
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    health_records_count = await Medical.countDocuments({});
  } catch (err) {
    const error = new HttpError("Fetching pets failed, please try again.", 500);
    return next(error);
  }

  res.status(200).json({ pets, health_records_count });
};

const getPetById = async (req, res, next) => {
  const petId = req.params.petId;
  let pets;
  let health;
  let vaccine;
  try {
    pets = await Pet.findById(petId);
    health = await Medical.findOne({ pet_id: petId });
    vaccine = await Vaccine.find({ pet_id: petId });
  } catch (err) {
    const error = new HttpError("Fetching pets failed, please try again.", 500);
    return next(error);
  }

  res.status(200).json({ pets, health, vaccine });
};

const updatePet = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data.", 422));
  }
  const {
    name,
    type,
    breed,
    age,
    weight,
    allergies,
    isactive,
    medical_condition,
    medication,
  } = req.body;
  const petId = req.params.petId;

  //Get pet by id
  let pet;
  let medical;
  try {
    pet = await Pet.findById(petId);
    medical = await Medical.findOne({ pet_id: petId });
  } catch (err) {
    return next(new HttpError("Fetching pet failed, please try again.", 500));
  }

  if (!pet) {
    return next(new HttpError("Could not find pet with the provided ID.", 404));
  }

  pet.name = name;
  pet.type = type;
  pet.breed = breed;
  pet.age = age;
  pet.isactive = isactive;
  pet.weight = weight;
  medical.allergies = allergies;
  medical.medical_condition = medical_condition;
  medical.medication = medication;

  try {
    // Save the updated pet
    const savedPet = await pet.save();
    const savedMedical = await medical.save();
  } catch (err) {
    return next(new HttpError("Updating pet failed, please try again.", 500));
  }

  res.status(200).json({ message: "Pet updated successfully", pet });
};

const addvaccination = async (req, res, next) => {
  const errors = validationResult(req);
  const petId = req.params.petId;
  console.log(req.body, petId);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(" Invalid inputs passed, please check your data.", 422)
    );
  }
  const { vaccine_type, date } = req.body;
  const addVaccine = new Vaccine({
    pet_id: petId,
    vaccine_type,
    date: date,
  });

  try {
    await addVaccine.save();
  } catch (err) {
    const error = new HttpError("Vaccine add failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({
    message: "Pet was vaccinated successfully",
  });
};

exports.updatePet = updatePet;
exports.getAllPet = getAllPet;
exports.getPetById = getPetById;
exports.createpet = createpet;
exports.addvaccination = addvaccination;
