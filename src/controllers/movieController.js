import movieService from '../services/movieService.js';
import logger from '../utils/logger.js';
import movieDataValidation from "../validations/movieDataValidation.js";

let instance = null;

class MovieController{
    getMovies = async (req, res, next) => {
        try{
            let query = (req.query.query === null || req.query.query === undefined) ? "" : req.query.query;
            let quantity = (req.query.quantity === null || req.query.quantity === undefined || isNaN(parseInt(req.query.quantity))) ? 20 : +req.query.quantity;
            let page = (req.query.page === null || req.query.page === undefined || isNaN(req.query.page)) ? 1 : +req.query.page;
            let sort = {}
            if(req.query.qualification_sort !== null && req.query.qualification_sort !== undefined && (req.query.qualification_sort === "qualification.asc" || req.query.qualification_sort === "qualification.desc")){
                sort.qualification = (req.query.qualification_sort === "qualification.asc") ? 1 : -1;
            }
            if(req.query.release_sort !== null && req.query.release_sort !== undefined && (req.query.release_sort === "release.asc" || req.query.release_sort === "release.desc")){
                sort.release_date = (req.query.release_sort === "release.asc") ? 1 : -1;
            }
            let genre = (req.query.genre !== null && req.query.genre !== undefined) ? req.query.genre : "";
            let items = await movieService.getMovies(genre, query, quantity, page, sort);
            logger.info(`GET REQUEST successful for movies`);
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
            movieDataValidation(req.body);
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