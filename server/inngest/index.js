import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";

export const inngest = new Inngest({ id: "movie-ticket-booking" , signingKey: process.env.INNGEST_SIGNING_KEY});

//inngest function to save user data to database
const syncUserCreation=inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event:'clerk/user.created'},
    async({event})=>{
        const{id,first_name,last_name,email_addresses,image_url}=event.data;
        const userData={
            _id:id,
            email:email_addresses[0].email_address,
            name:first_name+ ' '+last_name,
            image:image_url
        }
        await User.create(userData)
    }
)

//inngest function to delete user data from database
const syncUserDeletion=inngest.createFunction(
    {id:'delete-user-with-clerk'},
    {event:'clerk/user.deleted'},
    async({event})=>{
         const {id}= event.data;
         await User.findByIdAndDelete(id)
    }
)

//inngest function to update user data from database
const syncUserUpdation=inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event:'clerk/user.updated'},
    async({event})=>{
         const{id,first_name,last_name,email_addresses,image_url}=event.data;
          const userData={
            _id:id,
            email:email_addresses[0].email_address,
            name:first_name+ ' '+last_name,
            image:image_url
        }
        await User.findByIdAndUpdate(id,userData);
        
    }
)

const releaseSeatsAndDeleteBooking=inngest.createFunction(
    {id:'release-seats-delete-booking'},
    {event:'app/checkpayment'},
    async({event,step})=>{
      const tenMinutesLater=new Date(Date.now()+10*60*1000);
      await step.sleepUntil('wait-for-10-minutes',tenMinutesLater);

      await step.run('check-payment-status',async()=>{
        const bookingId=event.data.bookingId;
        const  booking=await Booking.findById(bookingId);

        // if payment is not made then release seats and delete booking
        if(!booking.isPaid){
            const show=await Show.findById(booking.show);
            booking.bookedSeats.forEach((seat)=>{
                delete show.occupiedSeats[seat];
            });
            show.markModified('occupiedSeats');
            await show.save();
            await Booking.findByIdAndDelete(booking._id);
        }

      })

    }
)

// function to send email  when user books a show 
const sendEmailConfirmationBookingEmail=inngest.createFunction(
    {id:'send-booking-confirmation-email'},
    {event:'app/show.booked'},
    async({event,step})=>{
         const {bookingId}=event.data;

         const booking=await Booking.findById(bookingId).populate({
            path:'show',
            populate:{
                path:"movie",
                model:"Movie"
            }
         }).populate('user');
         await sendEmail({
            to:booking.user.email,
            subject:`Booking Confirmation: "${booking.show.movie.title} " booked!`,
            body:`<p>Thanks for Booking with us!!</p>`
         });
    }

)

// inngest function to send remainders
const sendShowReminders=inngest.createFunction(
    {id:"send-show-reminders"},
    {cron:'0 */8 * * *'},
    async({step})=>{
        const now=new Date();
        const in8hours=new Date(now.getTime() + 8*60*60*1000);
        const windowStart=new Date(in8hours.getTime() - 10*60*1000);

        const reminderTasks=await step.run
        ("prepare-reminder-tasks", async()=>{
            const shows=await Show.find({
                showTime:{
                    $gte:windowStart,
                    $lte:in8hours,
                }
            }).populate('movie');

            const tasks=[];

            for(const show of shows){
                if(!show.movie || !show.occupiedSeats) continue;

                const userIds=[...new Set(Object.values(show.occupiedSeats))]
                if(userIds.length === 0) continue;

                const users=await User.find({_id:{$in:userIds}}).select('name email')
                
                for(const user of users){
                    tasks.push({
                        userEmail:user.email,
                        userName:user.name,
                        movieTitle:show.movie.title,
                        showTime:show.showTime,
                    })
                }
            }
            return tasks;
        })
        if(reminderTasks.length === 0){
            return {sent:0 , message:"No reminders to send"}
        }
        //send reminder emails
        const results=await step.run('send-all-reminders',async()=>{
            return await Promise.allSettled(
                reminderTasks.map(task=>sendEmail({
                    to:task.userEmail,
                    subject:`Reminder! Your Movie "${task.movieTitle}" starts sonn!! `,
                    body:`Enjoy the Show!`
                }))
            )
        })

        const sent=results.filter(r=>r.status === "fulfilled").length;
        const failed=results.length-sent;
        
        return{
            sent,
            failed,
            message:`Sent ${sent} reminders(s) ${failed} failed `
        }
    }

)

const sendNewShowNotifications=inngest.createFunction(
    {id:"send-new-show-notifications"},
    {event:"app/show.added"},
    async({event})=>{
        const {movieTitle,movieId} =event.data;

        const users=await User.find({});

        for(const user of users){
            const userEmail=user.email;
            const userName=user.name;

            const subject=`new Show Added ${movieTitle}`;
            const body=`<p>visit our website </p>`

             await sendEmail({
            to:userEmail,
            subject,
            body,
            })

        }
       return {message:"notifications sent. "}
    }
)

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendEmailConfirmationBookingEmail,
    sendShowReminders,
    sendNewShowNotifications
];