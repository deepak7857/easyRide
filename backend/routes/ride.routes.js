const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/create",
  authMiddleware.authUser,
  [
    body("Pickup")
      .isString()
      .isLength({ min: 3 })
      .notEmpty()
      .withMessage("Pickup location must be at least 3 characters long"),
    body("destination")
      .isString()
      .isLength({ min: 3 })
      .notEmpty()
      .withMessage("Destination must be at least 3 characters long"),
    body("vehicleType")
      .isString()
      .isIn(["auto", "bike", "car"])
      .notEmpty()
      .withMessage("Vehicle type is required and must be auto, bike, or car")
  ],
  rideController.createRide
);

router.get(
  "/ride-fair",
  authMiddleware.authUser,
  [
    query("Pickup")
      .isString()
      .notEmpty()
      .withMessage("Pickup is required"),
    query("destination")
      .isString()
      .notEmpty()
      .withMessage("Destination is required")
  ],
  rideController.getRideFair
);
router.post('/confirmRide',
  authMiddleware.authCaptain,
  body('rideId').isMongoId().withMessage("invailed id"),
  rideController.confirmRide
)
router.get("/start-ride", authMiddleware.authCaptain,query('rideId').isMongoId().withMessage('Invalid ride id'),
query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'), rideController.startRide);
router.post("/end-ride", authMiddleware.authCaptain,body('rideId').isMongoId().withMessage('Invalid ride id'), rideController.endRide);


module.exports = router;