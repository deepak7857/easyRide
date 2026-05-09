const mongoose=require("mongoose");
const bcrypt =require("bcrypt");
const jwt=require("jsonwebtoken");


const captainSchema = new mongoose.Schema({
  fullName:{ 
    firstName:{
      type:String,
      required:true,
      minlength: [ 3, 'First name must be at least 3 characters long' ],
    },
    lastName:{
      type:String,
      minlength: [ 3, 'last name must be at least 3 characters long' ],
    }
  },
  email:{
type:String,
required:true,
unique:true,
 lowercase:true,
match:[ /^\S+@\S+\.\S+$/, 'Please enter a valid email' ]
  },
  password:{
    type:String,
    required:true,
    select: false,
    
  },
  socketId:{
    type:String,
  },
  vehicle:{
    color:{
      type:String,
      required:true,
      minlength:[3,"color length must be atleast 3characters "]
    },
    plate:{
      type:String,
      required:true,
      minlength:[3,"plate length must be atleast 3characters "]
    },
    capacity:{
      type:Number,
      required:true,
      minlength:[1,"capacity atleast 1"],
    },
    
      vehicleType:{
        type:String,
        required:true,
        enum:['car','bike','auto','motorcycle']
      },
      location:{
        type:{
          type:String,
          enum:['Point'],
          default:'Point',
        },
        coordinates:{
          type:[Number],
          default:[0,0],
        }
      }
    }
  }

);

captainSchema.index({ 'vehicle.location': '2dsphere' });


captainSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
};

captainSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password,this.password)
};
captainSchema.statics.hashPassword= async function(password){
  return await bcrypt.hash(password,10);
}

const captainModel = mongoose.model('captain', captainSchema);
module.exports = captainModel;