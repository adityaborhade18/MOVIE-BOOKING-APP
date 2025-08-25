// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth, useUser } from "@clerk/clerk-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;
// axios.defaults.withCredentials = true;  

// export const AppContext = createContext();

// export const AppContextProvider = ({ children }) => {

//     const [isAdmin,setIsAdmin]=useState(false);
//     const [shows,setShows]=useState([]);
//     const [favoriteMovies,setFavoriteMovies]=useState([]);

//     const image_base_url=import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

//     const {user}=useUser();
//     const {getToken}=useAuth();
//     const location=useLocation();
//     const navigate=useNavigate();

//   const fetchIsAdmin = async () => {
//   try {
//     const token = await getToken();
//     if (!token) return; 

//     console.log("token is", token);

//     const { data } = await axios.get('/api/admin/is-admin', {
//       withCredentials: true,
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     console.log('data from the backend', data);

//     setIsAdmin(data.isAdmin);

//     if (!data.isAdmin && location.pathname.startsWith('/admin')) {
//       navigate('/');
//       toast.error("You are not authorized to access the admin dashboard");
//     }
//   } catch (error) {
//     console.error("error from frontend", error);
//     toast.error(error.response?.data?.message || error.message);
//     setIsAdmin(false);
//   }
// };



// // const fetchIsAdmin = async () => {
// //   try {
// //     // 👇 fetch token from Clerk
// //     const token = await getToken({ template: "session" });

// //     const res = await axios.get("/api/admin/is-admin", {
// //       headers: {
// //         Authorization: `Bearer ${token}`,  // 👈 MUST send this
// //       },
// //       withCredentials: true,
// //     });

// //     console.log("Admin check:", res.data);
// //   } catch (err) {
// //     console.error("Axios error:", err);
// //   }
// // };







    
   


//     const fetchShows=async()=>{
//         try{
//             const {data}=await axios.get('/api/show/all');
//             if(data.success){
//                 setShows(data.shows);
//             }else{
//                 toast.error(data.message);
//             }
//         }catch(error){
//             console.error(error); 
//         }
//     }
     
//     const fetchFavoritesMovies=async()=>{
//         try{
//            const {data}= await axios.get('/api/user/favorites',{
//             headers:{
//                      Authorization:`Bearer ${await getToken()}`,
//                 },
//            });
//            if(data.success){
//              setFavoriteMovies(data.movies);
//            }
//            else{
//             toast.error(data.message);
//            }
//         }catch(error){
//             console.log(error);
//         }
//     }

//     useEffect(()=>{
//         fetchShows();
//     },[]);

//     useEffect(()=>{
//         if(user){
//             fetchIsAdmin();
//             fetchFavoritesMovies();
//         }
//     },[user]);

//     const value={axios,fetchIsAdmin,user,getToken,navigate,isAdmin,shows,
//         favoriteMovies,fetchFavoritesMovies,image_base_url
//     }

//     return (
//         <AppContext.Provider value={value}>
//             {children}
//         </AppContext.Provider>
//     );
// };

// export const useAppContext = () => useContext(AppContext);


import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Create Axios instance
  const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
  });

  // Axios interceptor to attach Clerk token automatically
  api.interceptors.request.use(async (config) => {
    const token = await getToken({ template: "session" });
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const fetchIsAdmin = async () => {
    try {
      const { data } = await api.get("/api/admin/is-admin");
      console.log("Admin check:", data);
      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access the admin dashboard");
      }
    } catch (err) {
      console.error("Axios error:", err);
      toast.error(err.response?.data?.message || err.message);
      setIsAdmin(false);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await api.get("/api/show/all");
      if (data.success) setShows(data.shows);
      else toast.error(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFavoritesMovies = async () => {
    try {
      const { data } = await api.get("/api/user/favorites");
      if (data.success) setFavoriteMovies(data.movies);
      else toast.error(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user) {
      fetchIsAdmin();
      fetchFavoritesMovies();
    }
  }, [user]);

  const value = {
    api,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    favoriteMovies,
    fetchFavoritesMovies,
    image_base_url,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);



