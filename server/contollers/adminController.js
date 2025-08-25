import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";



// api to check if user is admin
// server/controllers/adminController.js
import { getAuth, clerkClient } from "@clerk/express";

export const isAdmin = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized: No userId" });

    const user = await clerkClient.users.getUser(userId);
    const isAdmin = user.privateMetadata.role === "admin";

    res.json({ success: true, isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



// api to  get dashboard data 
export const getDashboardData=async(req,res)=>{
    try{
     const bookings= await Booking.find({isPaid:true});
     const activeShows=await Show.find({showDateTime:{$gte:new Date()}}).populate('movie');
     const totalUser=await User.countDocuments();

     const dashboardData={
        totalBookings:bookings.length,
        totalRevenue:bookings.reduce((acc,booking)=> acc+booking.amount,0),
        activeShows,
        totalUser,
     }
     res.json({success:true, dashboardData});
    }catch(error){
     console.log(error);
     res.json({success:false, message:error.message});
    }
}


// api to  get all shows
export const getAllShows=async(req,res)=>{
    try{
     const shows=await Show.find({showDateTime:{$gte:new Date()}}).populate('movie').sort({showDateTime:1});
     res.json({success:true, shows});
    
    }catch(error){
     console.log(error);
     res.json({success:false, message:error.message});
    }
}

// api to get all bookings
export const getAllBookings=async(req,res)=>{
    try{
      const bookings=await Booking.find({}).populate('user').populate({
        path:'show',
        populate:{path:'movie'},
      }).sort({createdAt:-1});
      res.json({success:true, bookings});
    }catch(error){
        console.log(error)
        res.json({success:false, message:error.message});
    }
}