const express = require("express");
const { check } = require("express-validator");

const petController = require("../controllers/pet-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();
router.post(
  "/createpet",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("type").not().isEmpty(),
    check("breed").isLength({ min: 3 }),
  ],
  petController.createpet
);
router.post(
  "/addvaccine/:petId",
  [check("vaccine_type").isLength({ min: 1 })],
  petController.addvaccination
);

router.get("/dashboard", petController.getAllPet);
router.get("/getpetbyid/:petId", petController.getPetById);
router.patch(
  "/updatepet/:petId",
  [check("name").not().isEmpty()],
  petController.updatePet
);
module.exports = router;
