import express from "express"
import { requireAuth } from "@clerk/express";
import { getFavorites, getSearch, getUserBookings, updateFavorite } from "../contollers/userController.js";

const userRouter=express.Router();

userRouter.get('/bookings', getUserBookings);
userRouter.post('/update-favorite',updateFavorite);
userRouter.get('/favorites', requireAuth(),getFavorites);
userRouter.get('/search',getSearch);

export default userRouter;

