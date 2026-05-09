const captainModel=require("../model/captain.model");
module.exports.createCaptain =async({
  firstName, lastName, email, password, color, plate, capacity, vehicleType
  
})=>{
  
 if(!firstName||!lastName||!email||!password||!color||!plate||!capacity||!vehicleType){
  return {status:400,message:"Please fill all the fields"};
 }
 const normalizedVehicleType = normalizeVehicleType(vehicleType);

 const captain = await captainModel.create({
  fullName:{
    firstName,
    lastName
  }, email, password, vehicle:{
    color, plate, capacity, vehicleType: normalizedVehicleType
  },
  });
 return captain;
}

function normalizeVehicleType(vehicleType){
  if(!vehicleType) return vehicleType;
  const vt = String(vehicleType).toLowerCase();
  if(['bike','moto','motorbike','motorcycle'].includes(vt)) return 'motorcycle';
  if(['car'].includes(vt)) return 'car';
  if(['auto','autorickshaw'].includes(vt)) return 'auto';
  return vt;
}