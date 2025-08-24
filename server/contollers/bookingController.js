// import Booking from "../models/Booking.js";
// import Show from "../models/Show.js"

// const checkSeatsAvailability=async(showId,selectedSeats)=>{
//     try{
//       const showData=await Show.findById(showId);
//       if(!showData) return false;

//       const occupiedSeats=showData.occupiedSeats;
//       const isAnySeatTaken=selectedSeats.some(seat=>occupiedSeats[seat]);

//       return !isAnySeatTaken;
//     }catch(error){
//      console.log(error);
//      return false;
//     }
//   }


// export const createBooking=async(req,res)=>{
//   try{
//     const {userId}=req.auth();
//     const {showId,selectedSeats}=req.body;
//     const {origin} = req.headers;

//       const isAvailable=await checkSeatsAvailability(showId,selectedSeats);

//       if(!isAvailable){
//         return res.json({success:false, message:"selected seats are not available"});
//       }
//       const showData=await Show.findById(showId).populate('movie');
//       const booking=await Booking.create({
//         user:userId,
//         show:showId,
//         amount:showData.showPrice*selectedSeats.length,
//         bookedSeats:selectedSeats,
//       })

//       selectedSeats.map((seat)=>{
//         showData.occupiedSeats[seat]=userId;  
//       })
//       showData.markModified('occupiedSeats');
//       await showData.save();

//       // stripe gateway initialize 
//       res.json({success:true, message:"booking created successfully"});

//   }catch(error){
//      console.log(error.message);
//      res.json({success:false, message:error.message});
//   }
// }


// export const getOccupiedSeats=async(req,res)=>{
//   try{
//      const {showId}= req.params;
//      const showData=await Show.findById(showId);
//      const occupiedSeats=Object.keys(showData.occupiedSeats);
//      res.json({success:true, data:occupiedSeats});
//   }catch(error){
//     console.log(error.message);
//     res.json({success:false, message:error.message});
//   }
// }

import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats || {};
    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user?.id || req.auth?.userId; 
    const { showId, selectedSeats } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "Unauthorized user" });
    }

    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Selected seats are not available",
      });
    }

    const showData = await Show.findById(showId).populate("movie");

    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    // Mark seats as occupied
    selectedSeats.forEach((seat) => {
      showData.occupiedSeats[seat] = userId;
    });
    showData.markModified("occupiedSeats");
    await showData.save();

    return res.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    const occupiedSeats = Object.keys(showData.occupiedSeats || {});
    res.json({ success: true, occupiedSeats }); // ✅ match frontend
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
