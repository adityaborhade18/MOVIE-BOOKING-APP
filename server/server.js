import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/dbConfig.js';
import {clerkMiddleware} from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';




const app=express();
const port =process.env.PORT || 3000;

await connectDB()
.then(()=>{
    console.log('connected to database');
})
.catch((err)=>{
    console.log('error connecting to database',err);
})

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173',
  credentials: true}));
app.use(clerkMiddleware());





app.get('/',(req,res)=>{
   res.send("Server is live !")
})
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use('/api/show',showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);



app.listen(port , ()=>{
    console.log(`server is running at http://localhost:${port}`);
})