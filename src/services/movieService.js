import { Error } from "../error/error.js";
import Movie from "../models/movie.js";
import { ObjectId } from 'mongodb';
import movieRepository from "../repositories/movieRepository.js";
import genreService from "./genreService.js";
import movieDataValidation from "../validations/movieDataValidation.js";

let instance = null;

class MovieService{
    constructor(){
        this.container = movieRepository;
    }
    checkExistingMovie = async (movieID) => {
        let movieFound = await this.container.getItemByID(movieID);
        return (movieFound !== null && movieFound.length !== 0);
    }
    getMovieByID = async(movieID) => {
        let movie = await this.container.getItemByID(movieID)
        let genre = await genreService.getGenre(movie.getGenre())
        movie.setGenre(genre);
        return movie;
    }
    getAllItems = async () => {
        let items = await this.container.getAllItems();
        if(items < 1){
            throw new Error(`No movie was found`, 'BAD_REQUEST');
        }
        if(items.length === undefined){
            let genre = await genreService.getGenre(items.getGenre())
            items.setGenre(genre);
            return items.toDTO();
        }
        let itemsDTO = [];
        for (let index = 0; index < items.length; index++) {
            let movie = items[index]
            let genre = await genreService.getGenre(movie.getGenre())
            movie.setGenre(genre);
            itemsDTO.push(movie.toDTO())
        }
        return itemsDTO;
    }
    getMovie = async (movieID) => {
        if(!(await this.checkExistingMovie(movieID))){
            throw new Error(`No movie was found matching ID ${movieID}`, 'BAD_REQUEST');
        }
        return await (await this.getMovieByID(movieID)).toDTO();
    }
    getMovieComments = async (movieID) => {
        if(!(await this.checkExistingMovie(movieID))){
            throw new Error(`No movie was found matching ID ${movieID}`, 'BAD_REQUEST');
        }
        return (await this.getMovieByID(movieID)).GetComments().map(comment => comment.toDTO());
    }
    getMovieContent = async (movieID) => {
        if(!(await this.checkExistingMovie(movieID))){
            throw new Error(`No movie was found matching ID ${movieID}`, 'BAD_REQUEST');
        }
        return await (await this.getMovieByID(movieID)).getContent();
    }
    createMovie = async ({title, subtitle, synopsis, genre, default_poster, images, videos, release_date, duration, qualification, qualifiers, crew, cast, comments}) => {
        movieDataValidation({title, subtitle, synopsis, default_poster, images, videos, release_date, duration, qualification, qualifiers, crew, cast});
        let existingGenre = await genreService.checkExistingGenre(genre);
        if(!existingGenre){
            throw new Error(`No genre was found matching ID ${genre}`, 'BAD_REQUEST');
        }
        let newMovie = new Movie({
            title: title,
            subtitle: subtitle,
            synopsis: synopsis,
            genre: ObjectId(genre),
            default_poster: default_poster,
            images: images,
            videos: videos,
            release_date: release_date,
            duration: +duration,
            qualification: +qualification,
            qualifiers: +qualifiers,
            crew: crew,
            cast: cast,
            comments: comments
        });
        let movieID = await this.container.save(newMovie);
        if(!movieID){
            throw new Error(`There was an error creating the movie`, 'INTERNAL_ERROR') 
        }
        return movieID;
    }
    addQualification = async(newComment) => {
        let idMovie = newComment.getMovieID();
        if(!(await this.checkExistingMovie(idMovie))){
            throw new Error(`No movie was found matching ID ${idMovie}`, 'BAD_REQUEST');
        }
        let movie = await getMovieByID(idMovie);
        movie.addComment(newComment);
        movie.addQualification(newComment.qualification)
        let movieID = await this.container.modifyByID(idMovie, movie.toDTO())
        if(!movieID){
            throw new Error(`There was an error adding the comment to the movie`, 'INTERNAL_ERROR') 
        }
        return movieID;
    }
    static getInstance(){
        if(!instance){
            instance = new MovieService();
        }
        return instance;
    }
}
export default MovieService.getInstance();