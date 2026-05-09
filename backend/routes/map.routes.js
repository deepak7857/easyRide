const express = require("express");
const router = express.Router();
const { query } = require("express-validator");
const mapController = require("../controllers/map.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get(
  "/getCoordinate",
  [
    query("address")
      .isLength({ min: 3 })
      .notEmpty()
      .withMessage("Address must be at least 3 characters long")
  ],
  authMiddleware.authUser,
  mapController.getCoordinate
);

router.get(
  "/getdistancetime",
  [
    query("Pickup")
      .isString()
      .isLength({ min: 3 })
      .notEmpty()
      .withMessage("Origin must be at least 3 characters long"),
    query("destination")
      .isString()
      .isLength({ min: 3 })
      .notEmpty()
      .withMessage("Destination must be at least 3 characters long")
  ],
  authMiddleware.authUser,
  mapController.getDistanceTime
);

router.get(
  "/getsuggestions",
  [
    query("input")
      .isString()
      .isLength({ min: 3 })
      .notEmpty()
      .withMessage("Input must be at least 3 characters long")
  ],
  authMiddleware.authUser,
  mapController.getAutoSuggestion
);

module.exports = router;