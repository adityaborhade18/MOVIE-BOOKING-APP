// import React, { useEffect, useState } from 'react'

// import { useNavigate, useParams } from 'react-router-dom';
// import BlurCircle from '../components/BlurCircle';
// import {Heart, PlayCircleIcon, StarIcon} from 'lucide-react'
// import timeFormat from '../lib/timeFormat';
// import DateSelect from '../components/DateSelect';
// import MovieCard from '../components/MovieCard';
// import Loading from '../components/Loading';
// import { useAppContext } from '../context/AppContext';
// import toast from 'react-hot-toast';

// const MovieDetails = () => {
//   const navigate=useNavigate();
//   const {id} = useParams();
//   const [show,setShow]=useState(null);

// const {shows, getToken,axios,user,favoriteMovies,fetchFavoriteMovies,image_base_url} = useAppContext();
  

//   const getshow=async()=>{
//    try{
//       const {data}=await axios.get(`/api/show/${id}`);
//       if(data.success){
//         setShow(data);
//       }
//    }catch(error){
//      console.log(error);
//    }
    
//   }

//   const handleFavorite=async()=>{
//       try{
//         if(!user) return toast.error("please, Login to procced");
//         const {data} = await axios.post('/api/user/update-favorite', {movieId:id},
//           {headers:{
//             Authorization :`Bearer ${await getToken()}`
//           }}
//         )
//         if(data.success){
//           await fetchFavoriteMovies();
//           toast.success(data.message);
//         }
//       }catch(error){
//          console.log(error);
//       }
//   }

//   useEffect(()=>{
//     getshow();
//   },[id]);

 

  
//   return show ?(
//     <div className='px-6 md:px-16 lg:px-40 mt-30 md:pt-50'>
//       <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
//          <img src={image_base_url + show.movie.poster_path} alt="" className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'/>

//          <div className='relative flex flex-col gap-3'>
//             <BlurCircle top='-100px' left='-100px'/>
//             <p className='text-primary'>ENGLISH</p>
//             <h1 className='text-4xl font-semibold max-w-96 text-balance'>{show.movie.title}</h1>
//             <div className='flex items-center gap-2 text-gray-300'>
//                 <StarIcon className='w-5 h-5 text-primary fill-primary'/>
//                 {show.movie.vote_average.toFixed(1)} User Rating
//             </div> 
//             <p className='text-gray-400 mt-2 leading-tight text-sm max-w-xl'>{show.movie.overview}</p>

//              <p>
//               {timeFormat(show.movie.runtime)}.{show.movie.genres.map(genre=>genre.name).join(', ')}
//               .{show.movie.release_date.split("-")[0]}
//              </p>

//              <div className='flex items-center  flex-wrap gap-4 mt-4 '>
//               <button className='flex items-center gap-2 px-7 py-2 text-sm  bg-gray-800 hover:bg-gray-900 
//                 transition font-medium rounded-md cursor-pointer active:scale-95
//               '>
//               <PlayCircleIcon className='w-5 h-5'/>
//                 Watch Trailers</button>
//               <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull 
//               transition font-medium rounded-md cursor-pointer active:scale-95'>Buy Tickets</a>
//               <button onClick={handleFavorite} className='bg-gray-700 p-2.5 rounded-full cursor-pointer active:scale-95  '>
//                 <Heart className={`w-5 h-5 ${favoriteMovies.find(movie=> movie._id===id) ? 'fill-primary text-primary' : ''} `}/>
//               </button>
//              </div>

//          </div>
//       </div>

//       <p className='mt-20 font-medium  text-lg'>Your Favorite Cast</p>
//       <div className='overflow-x-auto no-scrollbar mt-8  pb-4 whitespace-nowrap'>
//          <div className='flex items-center gap-4 w-max px-4'>
//             {show.movie.casts.slice(0,12).map((cast,index)=>(
//               <div key={index} className='flex flex-col items-center text-center '>
//                 <img src={cast.image_base_url + cast.profile_path} alt="" className='rounded-full  h-20 md:h-20 aspect-square object-cover ' />
//                 <p className='font-medium text-xs mt-3'>{cast.name}</p>
//               </div>
//             ))}
//          </div>
//       </div>

//       <DateSelect dateTime={show.dateTime} id={id}/>

//       <p className='text-lg font-medium mt-20 mb-8'>You May also Like</p>
//       <div className='flex flex-row flex-wrap max-sm:justify-center gap-8'>
//               {shows.slice(0,4).map((movie,index)=>(
//                <MovieCard key={index} movie={movie}  />
//            ))}
//       </div>

//       <div className='flex justify-center mt-20 '>
//         <button onClick={()=>{navigate('/movies');scrollTo(0,0)}} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer '>
//               Show More
//         </button>
//       </div>
           
//     </div>
//   ): <Loading/>
// }
 
// export default MovieDetails;


import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import BlurCircle from '../components/BlurCircle';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';

import timeFormat from '../lib/timeFormat';
import { useAppContext } from '../context/AppContext';

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loadingFav, setLoadingFav] = useState(false);

  const { shows, getToken, axios, user, favoriteMovies, fetchFavoritesMovies, image_base_url } = useAppContext();
  console.log("moviedetails",shows);
  // Fetch movie details
  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) setShow(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load movie details");
    }
  };

  // Handle add/remove favorite
  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");
      setLoadingFav(true);
    
      const { data } = await axios.post(
        '/api/user/update-favorite',
        { movieId: id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
   
      if (data.success) {
        
        await fetchFavoritesMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating favorites");
    } finally {
      setLoadingFav(false);
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  if (!show) return <Loading />;

  const movie = show.movie;
  const isFavorite = favoriteMovies.some(movie => movie._id === id);
   
  return (
    <div className="px-6 md:px-16 lg:px-40 mt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={movie.poster_path ? image_base_url + movie.poster_path : "/placeholder.png"}
          alt={movie.title}
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />

          <p className="text-primary">ENGLISH</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">{movie.title}</h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {movie.vote_average?.toFixed(1)} User Rating
          </div>

          <p className="text-gray-400 mt-2 leading-tight text-sm max-w-xl">
            {movie.overview}
          </p>

          <p className="text-sm text-gray-300">
            {timeFormat(movie.runtime)} • {movie.genres?.map(genre => genre.name).join(', ')} • {movie.release_date?.split("-")[0]}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-2 text-sm bg-gray-800 hover:bg-gray-900 transition font-medium rounded-md cursor-pointer active:scale-95">
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>

            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition font-medium rounded-md cursor-pointer active:scale-95"
            >
              Buy Tickets
            </a>

            <button
              onClick={handleFavorite}
              disabled={loadingFav}
              className={`p-2.5 rounded-full cursor-pointer active:scale-95 ${loadingFav ? "opacity-50 pointer-events-none" : "bg-gray-700"}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Cast
      <p className="mt-20 font-medium text-lg">Your Favorite Cast</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4 whitespace-nowrap">
        <div className="flex items-center gap-4 w-max px-4">
          {movie.casts?.slice(0, 12).map((cast, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <img
                src={image_base_url + cast.profile_path }
                alt={cast.name}
                className="rounded-full h-20 md:h-20 aspect-square object-cover"
              />
              <p className="font-medium text-xs mt-3">{cast.name}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* Date Select */}
      <DateSelect dateTime={show.dateTime} id={id} />

      {/* Recommended Movies */}
      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-row flex-wrap max-sm:justify-center gap-8">
        {shows.slice(0, 4).map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate('/movies');
            scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default MovieDetails;



