const { model } = require("mongoose");
const userModel = require("../model/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../model/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fullName: { firstName, lastName }, email, password } = req.body;
        
    
        const isUserAlready = await userModel.findOne({ email });
    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }
        const hashedPassword = await userModel.hashPassword(password);
        const user = await userService.createUser({ firstName, lastName, email, password: hashedPassword });
        const token = user.generateAuthToken();
        res.status(201).json({ message: "User registered successfully", user, token });
    } catch (error) {
        console.error(error);
        res.status(409).json({ message: "duplicate data ", error: error.message });
    }
};
module.exports.loginUser=async (req,res,next) =>{
   const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
   const {email,password}=req.body;
   if(!email || !password){
       return res.status(404).json({message:"All fields are required"});
   }

    try{
        
         const user=await userModel.findOne({email}).select("+password");
         if(!user){
              return res.status(401).json({message:"invalid email or password"});
         }
         const isMatch=await user.comparePassword(password);
         if(!isMatch){
              return res.status(401).json({message:"Invalid password"});
         }
         const token=user.generateAuthToken();
         res.cookie("token",token);
         res.status(200).json({message:"User logged in successfully",user,token});

       }catch(error){
           console.error(error);
           res.status(500).json({message:"Internal server error",error:error.message});
       }    
    };
module.exports.getUserProfile=async (req,res,next)=>{
 res.status(200).json({user:req.user});
 };
module.exports.logoutUser=async (req,res,next)=>{
  
    const token=req.cookies.token||req.headers.authorization.split(' ')[1];
    await blackListTokenModel.create({token});
    res.clearCookie("token");
    res.status(200).json({message:"User logged out successfully"});

};
