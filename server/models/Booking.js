import mongoose from 'mongoose';

const boookingSchema=new mongoose.Schema({
    user:{
        type:String,
        required:true,
        ref:"User",
    },
    show:{
        type:String,
        required:true,
        ref:"Show",
    },
    amount:{
        type:Number,
        required:true,
    },
    bookedSeats:{
        type:Array,
        required:true,
    },
    isPaid:{
        type:Boolean,
        default:false,
    },
    paymentLink:{
        type:String,
    }
},{timestamps:true})

const Booking=mongoose.moedel("Booking", boookingSchema);
export default Booking;