import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required: true,
        trim:true
    },
    description:{
        type:String,
        required: true
    },
    brand:{
        type:String,
        default:""
    },
    price:{
        type:Number,
        required: true
    },
    discount:{
        type:Number,
        default: 0
    },
    stock:{
        type:Number,
        require:true,
        default:0
    },
    productImage:[
        {
            type:String
        }
    ],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    rating:{
        type: Number,
        default:0
    },
    review:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            comment:String,
            reating:Number,
            createdAt:{
                type:Date,
                default:Date.now
            }
        }
    ], 

    isActive:{
        type: Boolean,
        default: true
    }
}, {timestamps: true})

export const Product = mongoose.model("Product", productSchema)