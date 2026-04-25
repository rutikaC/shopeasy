import mongoose  from "mongoose";

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types,ObjectId,
        ref:User,
        required: true
    },
    orderItems:[
        {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Proudct",
            required: true
        },
        quantity:{
            type:Number,
            required:true,
        },
        price:{
            type:Number,
            required:true
        }
    }
    ],
    orderTotal:{
        type:Number,
        required:true
    },
    orderDiscount:{
        type:Number,
        default:0
    },
    finalAmount:{
        type:Number,
        required: true
    },
    deliveryAddress:{
        fullName: String,
        phone:String,
        street: String,
        city:String,
        state:String,
        pincode:String
    },
    orderStatus:{
        type:String,
        enum:["pending", "processing", "shipped", "delivered", "cancelled"],
        default:"Pending"
    },
    paymentInfo:{
        method:{
            type:String,
            enum:["razorpay", "cod"],
            default: "cod"
        },
        status:{
            type:String,
            enum:["pending", "paid", "failed"],
            default:"pending"
        },
        transactionId:String
    },
    deliveredAt:Date
   
},{timestamps: true})

export const Order = mongoose.model("Order", orderSchema)