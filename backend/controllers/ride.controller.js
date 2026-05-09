const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');

const mapService = require("../services/map.services");
const ridemode= require("../model/ride.model");
const { sendMessageToSocketId } = require('../socket');
module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { Pickup, destination, vehicleType } = req.body;
  console.log(req.body);

  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const ride = await rideService.createRide(req.user._id, Pickup, destination, vehicleType);
    
    res.status(201).json(ride);
    
    // Notify captains of new ride (async process)
    const pickupCoordinates = await mapService.getAddressCoordinate(Pickup);
    console.log("Pickup coordinates:", pickupCoordinates);

    // Try with increased radius of 10km first for testing
    const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.latitude, pickupCoordinates.longitude, 10);
    console.log("Total captains in radius:", captainsInRadius.length);
    
    const ridewithuser = await ridemode.findOne({_id: ride._id}).populate('user');
    console.log("Ride with user populated. Ride ID:", ridewithuser._id, "User ID:", ridewithuser.user._id);
    
    if (captainsInRadius.length > 0) {
      captainsInRadius.forEach(captain => {
        console.log("Emitting new-ride to captain room:", captain._id, "current socketId:", captain.socketId);
        sendMessageToSocketId(captain._id, {
          event: 'new-ride',
          data: ridewithuser
        });
        if (captain.socketId) {
          sendMessageToSocketId(captain.socketId, {
            event: 'new-ride',
            data: ridewithuser
          });
        }
      });
    } else {
      console.log("WARNING: No captains found in 10km radius for pickup location:", Pickup);
    }

  } catch (error) {
    console.log('Error creating ride:', error);
    res.status(500).json({ message: 'Error creating ride', error: error.message });
  }
};

module.exports.getRideFair = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { Pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(Pickup, destination);
    // console.log(fare);
    res.status(200).json(fare);
  } catch (error) {
    console.error('Error getting fare:', error);
    res.status(500).json({ message: 'Error getting fare', error: error.message });
  }
};
module.exports.confirmRide=async (req,res)=>{
  const errors=validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {rideId}=req.body;
  try {

    const ride=await rideService.confirmRide({rideId,captain:req.captain});
    console.log(ride);
    if(!ride){
      return res.status(404).json({message:"ride not found"});
    }
    sendMessageToSocketId(ride.user._id, {
            event: 'ride-confirmed',
            data: ride
        })
    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
          event: 'ride-confirmed',
          data: ride
        })
    }

    res.status(200).json(ride);
  } catch (error) {
    console.error('Error confirming ride:', error);
   return res.status(500).json({ message: 'Error confirming ride', error: error.message });
  }
}

module.exports.startRide=async (req,res)=>{
  const errors=validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {rideId,otp}=req.query;
  try {
    const ride=await rideService.startRide({rideId,otp,captain:req.captain});
    if(!ride){
      return res.status(404).json({message:"ride not found"});
    }
     sendMessageToSocketId(ride.user._id, {
            event: 'ride-started',
            data: ride
        })
     if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
          event: 'ride-started',
          data: ride
        })
     }

    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ message: 'Error getting fare', error: error.message });
  }
}
module.exports.endRide=async (req,res)=>{
  const errors=validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } 
  const {rideId}=req.body;
  try {
    const ride=await rideService.endRide({rideId,captain:req.captain});
    if(!ride){
      return res.status(404).json({message:"ride not found"});
    }
    sendMessageToSocketId(ride.user._id, {
            event: 'ride-ended',
            data: ride
        })
    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
          event: 'ride-ended',
          data: ride
        })
    }
    res.status(200).json(ride);
  }
  catch (error) {
    res.status(500).json({ message: 'Error getting fare', error: error.message });
  }
}