import movieService from '../services/movieService.js';
import logger from '../utils/logger.js';

let instance = null;

class MovieController{
    getAllMovies = async (req, res, next) => {
        try{
            let items = await movieService.getAllItems();
            logger.info(`GET REQUEST successful for all movies`);
            res.status(200).json(items);
        }
        catch(error){
            next(error);
        }
    }
    getMovieByID = async (req, res, next) => {
        try{
            let item = await movieService.getMovie(req.params.id);
            logger.info(`GET REQUEST successful for movie ${req.params.id}`);
            res.status(200).json(item);
        }
        catch(error){
            next(error);
        }
    }
    getMovieCommentsByID = async (req, res, next) => {
        try{
            let item = await movieService.getMovieComments(req.params.id);
            logger.info(`GET REQUEST successful for movie ${req.params.id}`);
            res.status(200).json(item);
        }
        catch(error){
            next(error);
        }
    }
    getMovieContentByID = async (req, res, next) => {
        try{
            let movieContent = await movieService.getMovieContent(req.params.id);
            logger.info(`GET REQUEST successful for movie ${req.params.id}`);
            res.status(200).json(movieContent);
        }
        catch(error){
            next(error);
        }
    }
    postMovie = async (req, res, next) => {
        try{
            //TODO add validation for attributes
            let movieID = await movieService.createMovie(req.body);
            logger.info(`POST REQUEST successful for movie ${movieID}`);
            res.status(200).json({message: `The movie with ID ${movieID} was added to the catalog.`});
        }
        catch(error){
            next(error);
        }
    }
    static getInstance(){
        if(!instance){
            instance = new MovieController();
        }
        return instance;
    }
}
export default MovieController.getInstance();