const captainModel=require("../model/captain.model")
const blackListTokenModel=require("../model/blacklistToken.model")
const captainService=require("../services/captain.service")
const {validationResult} = require('express-validator');

module.exports.captainRegister=async(req,res,next)=>{
const errors=validationResult(req);
if(!errors.isEmpty()){
  return res.status(400).json({errors:errors.array()});
}
try {
const {fullName:{firstName,lastName},email,password,vehicle:{color, plate, capacity, vehicleType}}=req.body;
const normalizedEmail = String(email).trim().toLowerCase();
console.log(req.body);
const isCaptainAlreadyExist = await captainModel.findOne({ email: normalizedEmail });
if (isCaptainAlreadyExist) {
  return res.status(400).json({ message: "Captain already exist" });
}
const hashedPassword = await captainModel.hashPassword(password);
const captain = await captainService.createCaptain({
  firstName,
  lastName,
  email: normalizedEmail,
  password: hashedPassword,
  color:color,
  plate: plate,
  capacity: capacity,
  vehicleType:vehicleType
});
const token = captain.generateAuthToken();
    res.status(201).json({ token, captain });
} catch (error) {
  console.error(error);
   res.status(409).json({ message: "duplicate data ", error: error.message });
}
}
module.exports.loginCaptain=async (req,res,next)=>{
  const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const{email,password}=req.body;
    if(!email || !password){
      return res.status(404).json({message:"All fields are required"});
  }
    try {
      const captain = await captainModel.findOne({ email }).select("+password");
      if (!captain) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const isValidPassword = await captain.comparePassword(password);
     if(!isValidPassword){
      return res.status(400).json({ message: "Invalid email or password" });
     }
      const token=captain.generateAuthToken();
      res.cookie('token', token);
      res.status(200).json({ token, captain });
}
catch (error) {
  console.error(error);
  return res.status(500).json({ message: "Internal server error", error: error.message });
}
}
module.exports.getCaptainProfile=async (req,res,next)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
 return res.status(201).json({
  message: "Profile retrieved successfully",captain:req.captain});
}
module.exports.logoutCaptain = async (req, res, next) => {
  try {
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1];   
      if (!token) {
          return res.status(400).json({ message: "No token found" });
      }
      // Check if token already exists in blacklist
      const existingToken = await blackListTokenModel.findOne({ token });
      if (!existingToken) {
          await blackListTokenModel.create({ token });
      }

      // Clear cookie from response
      res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
      });

      return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
          message: "Internal server error",
          error: error.message
      });
  }
};

