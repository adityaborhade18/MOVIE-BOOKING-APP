import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const [isAdmin,setIsAdmin]=useState(false);
    const [shows,setShows]=useState([]);
    const [favoriteMovies,setFavoriteMovies]=useState([]);

    const image_base_url=import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const {user}=useUser();
    const {getToken}=useAuth();
    const location=useLocation();
    const navigate=useNavigate();

    const fetchIsAdmin=async()=>{
        try{
            const {data}=await axios.get('/api/admin/is-admin',{
                headers:{
                     Authorization:`Bearer ${await getToken()}`,
                },
            })
            setIsAdmin(data.isAdmin);

            if(!data.isAdmin && location.pathname.startsWith('/admin')){
                navigate('/');
                toast.error("you are not authorized to access the admin dashboard");
            }
        }catch(error){
            console.error(error);
        }
    }

    // const fetchIsAdmin = async () => {
    //     try {
    //         // 1️⃣ Get token
    //         const token = await getToken();
    //         if (!token) {
    //             console.warn("No token found. User might not be logged in.");
    //             setIsAdmin(false);
    //             if (location.pathname.startsWith("/admin")) {
    //                 navigate("/");
    //                 toast.error("You are not authorized to access the admin dashboard");
    //             }
    //             return;
    //         }

    //         // 2️⃣ Call backend API
    //         const backendURL = "http://localhost:3000"; // adjust your backend port
    //         const { data } = await axios.get(`${backendURL}/api/admin/is-admin`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });

    //         // 3️⃣ Set admin state
    //         setIsAdmin(data?.isAdmin || false);

    //         // 4️⃣ Redirect non-admin users if on admin page
    //         if (!data?.isAdmin && location.pathname.startsWith("/admin")) {
    //             navigate("/");
    //             toast.error("You are not authorized to access the admin dashboard");
    //         }
    //     } catch (error) {
    //         // Handle Axios errors or unexpected errors
    //         if (axios.isAxiosError(error)) {
    //             console.error("Axios error:", error.response?.data || error.message);
    //             console.error("Status code:", error.response?.status);
    //         } else {
    //             console.error("Unexpected error:", error);
    //         }

    //         setIsAdmin(false);
    //         if (location.pathname.startsWith("/admin")) {
    //             navigate("/");
    //             toast.error("You are not authorized to access the admin dashboard");
    //         }
    //     }
    // };


    const fetchShows=async()=>{
        try{
            const {data}=await axios.get('/api/show/all');
            if(data.success){
                setShows(data.shows);
            }else{
                toast.error(data.message);
            }
        }catch(error){
            console.error(error); 
        }
    }
     
    const fetchFavoritesMovies=async()=>{
        try{
           const {data}= await axios.get('/api/user/favorites',{
            headers:{
                     Authorization:`Bearer ${await getToken()}`,
                },
           });
           if(data.success){
             setFavoriteMovies(data.movies);
           }
           else{
            toast.error(data.message);
           }
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchShows();
    },[]);

    useEffect(()=>{
        if(user){
            fetchIsAdmin();
            fetchFavoritesMovies();
        }
    },[user]);

    const value={axios,fetchIsAdmin,user,getToken,navigate,isAdmin,shows,
        favoriteMovies,fetchFavoritesMovies,image_base_url
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);



