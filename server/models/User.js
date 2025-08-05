import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:[true,'please enter the username'],
    },
    email:{
        type:String,
        required:[true,'please enter the email'],
    },
    image:{
        type:String,
        required:true,
    }

})

const User=mongoose.models.User || mongoose.model('User',userSchema);
export default User;