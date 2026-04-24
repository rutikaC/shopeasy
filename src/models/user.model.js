import mongoose  from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone:{
        type:Number,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    avatar:{
        type:String,
        default:""
    },
    role:{
        type:String,
        enum:["user", "admin"],
        default: user
    },
    addresses:[
        {
          fullName:String,
          phone:String,
          street:String,
          city: String,
          state:String,
          pincode: String,
          isDefault:{
            type:Boolean,
            default:false
          } 
        }
    ],
    cart:[
        {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        quantity:{
            type: Number,
            default:1
        }
        }
    ],
    wishlist:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ],

    orders:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Order"
        }
    ],

    refreshToken: {
        type:String,
    },

    resetPasswordToken: String,
    resetPasswordExpiry: Date,

    isAcitve:{
        type: Boolean,
        default:true
    }
}, {timestamps: true})

userSchema.pre("save", async function(next){
    //  do not save password each time 

    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect =  async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
     return jwt.sign(
        {
            _id: this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
     )
} 

export const User = mongoose.model("User", userSchema)