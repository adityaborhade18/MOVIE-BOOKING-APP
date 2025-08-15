import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import {dummyBookingData, dummyShowsData} from '../../assets/assets'
import Title from '../../components/admin/Title'
import dateFormat from '../../lib/dateFormat'
import { useAppContext } from '../../context/AppContext'

const ListBookings = () => {

  const currency=import.meta.env.VITE_CURRENCY

  const {user, getToken,axios}=useAppContext();

  const [bookings, setBookings]=useState([])
  const [loading, setLoading]=useState(true)



     const fetchAllBookings=async()=>{
      try{
        const {data} =await axios.get('/api/admin/all-bookings',{
          headers:{
            Authorization: `Bearer ${await getToken()}`
          }
        })
        setBookings(data.bookings);
      
      }catch(error){
       console.error(error);
      }
        setLoading(false);
       
     }

  useEffect(()=>{
    if(user){
      fetchAllBookings()
    }
    
  },[user])

  return !loading ?(
    <>
      <Title text1={"List"} text2={"Bookings"}/>
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
               <th className='p-2 font-medium pl-2'>User</th>
               <th className='p-2 font-medium'>Movie Name</th>
               <th className='p-2 font-medium'>Show Time</th>
               <th className='p-2 font-medium'> Bookings Seat </th>
               <th className='p-2 font-medium'>Amount</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
             {bookings.map((booking,index)=>(
                <tr key={index} className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'>
                       <td className='p-2 min-w-45 pl-2'>{booking.user.name}</td>
                       <td className='p-2'>{booking.show.movie.title}</td>
                       <td className='p-2'>{dateFormat(booking.show.showDateTime)}</td>
                       <td className='p-2'>{booking.bookedSeats}</td>
                       <td className='p-2'>{currency}{booking.amount}</td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>
    </>
  ) : <Loading/>
}

export default ListBookings
