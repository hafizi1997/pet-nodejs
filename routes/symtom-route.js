const express = require("express");
const { check } = require("express-validator");
const symtomController = require("../controllers/symtom-controller");
const router = express.Router();

router.post(
  "/createsymtom",
  [check("symtoms").not().isEmpty()],
  symtomController.createSymtom
);
router.patch(
  "/updatesymtom/:petId",
  [check("symtoms").not().isEmpty()],
  symtomController.updateSymtom
);

module.exports = router;
