const ridemodel = require('../model/ride.model');
const mapservice = require('../services/map.services');
const crypto = require('crypto');
const bcrypt =require('bcrypt');
const rideModel = require('../model/ride.model');

async function getFare(Pickup, destination) {

  if (!Pickup || !destination) {
    throw new Error('Pickup and destination are required');
}

const distanceTime = await mapservice.getDistanceTime(Pickup, destination);
const baseFare = {
    auto: 30,
    car: 50,
    bike: 20
};

const perKmRate = {
    auto: 10,
    car: 15,
    bike: 8
};

const perMinuteRate = {
    auto: 2,
    car: 3,
    bike: 1.5
};

const fare = {
    auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
    car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
    bike: Math.round(baseFare.bike + ((distanceTime.distance.value / 1000) * perKmRate.bike) + ((distanceTime.duration.value / 60) * perMinuteRate.bike))
};

return fare;


}
module.exports.getFare = getFare;

function getOtp(num) {
  function generateOtp(num) {
    const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
    return otp;
  }
  return generateOtp(num);
}

module.exports.createRide = async (user, Pickup, destination, vehicleType) => {
  if (!user || !Pickup || !destination || !vehicleType) {
    throw new Error("User, Pickup, destination, and vehicleType are required");
  }
  console.log(user,Pickup,destination,vehicleType);

  try {
    const fare = await getFare(Pickup, destination);
    console.log(fare);
    const ride = new ridemodel({
  user,
  Pickup,
  destination,
  otp: getOtp(6),
  fare: fare[vehicleType],
});
await ride.save();
return ride;
  } catch (error) {
    console.error("[createRide] Error:", error.message);
    throw new Error("Failed to create ride");
  }
};

module.exports.confirmRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }
console.log(rideId);
  const ride = await ridemodel.findByIdAndUpdate(
    rideId,

    {
      status: "accepted",
      captain: captain._id,
    },
    { new: true }
  )
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};
module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new Error("ride id and otp is required");
  }

  const ride = await ridemodel.findOne({ _id: rideId }).populate('user').populate('captain').select('+otp');
  if (!ride) {
    throw new Error("ride not found");
  }
  if (ride.status !== 'accepted') {
    throw new Error("Ride has not been accepted");
  }
  if (ride.otp !== otp) {
    throw new Error("Invalid otp");
  }

  await ridemodel.findByIdAndUpdate(rideId, {
    status: 'ongoing'
  });

  return ride;
};

module.exports.endRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("rideId is required");
  }

  const ride = await ridemodel.findOne({
    _id: rideId,
    captain: captain._id
  }).populate("user").populate('captain').select('+otp');
  if (!ride) {
    throw new Error("Ride id not found");
  }
  if (ride.status !== 'ongoing') {
    throw new Error('Ride not ongoing');
  }

  await ridemodel.findByIdAndUpdate(rideId, {
    status: 'completed'
  });

  return ride;
};