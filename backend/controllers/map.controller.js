const mapServices = require("../services/map.services");
const { validationResult } = require("express-validator");

exports.getCoordinate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;
  try {
    const coordinates = await mapServices.getAddressCoordinate(address);
    res.status(200).json({ coordinates });
  } catch (error) {
    res.status(400).json({ message: "Could not get coordinates" });
  }
};

exports.getDistanceTime = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }

  const { Pickup, destination } = req.query;

  

  if (!Pickup || !destination) {
    return res.status(400).json({ 
      message: "Pickup and destination are required" 
    });
  }

  try {
    const distanceTime = await mapServices.getDistanceTime(Pickup, destination);
    
    if (!distanceTime) {
      return res.status(404).json({ 
        message: "Could not calculate distance and time" 
      });
    }

    return res.status(200).json(distanceTime);

  } catch (error) {
    console.error('Distance calculation error:', error);
    return res.status(500).json({ 
      message: "Error calculating distance and time",
      error: error.message 
    });
  }
};

exports.getAutoSuggestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { input } = req.query;

  try {
    const suggestions = await mapServices.getAutoSuggestion(input);
   
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(400).json({ message: "Could not get suggestions" });
  }
};