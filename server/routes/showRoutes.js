import express from 'express';
import { addShow, getNowPlayingMovies } from '../contollers/showController.js';

const showRouter=express.Router();

showRouter.get('/now-playing',getNowPlayingMovies)
showRouter.post('/add',addShow)


export default showRouter