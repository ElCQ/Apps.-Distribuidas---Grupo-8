import { Error } from "../error/error.js";
import Movie from "../models/movie.js";
import movieRepository from "../repositories/movieRepository.js";
import { randomUUID } from 'crypto';

let instance = null;

class MovieService{
    constructor(){
        this.container = movieRepository;
    }
    checkExistingMovie = async (movieID) => {
        let movieFound = await this.container.getItemByID(movieID);
        return (movieFound !== null && movieFound.length !== 0);
    }
    getAllItems = async () => {
        let items = await this.container.getAllItems();
        if(items < 1){
            throw new Error(`No movie was found`, 'BAD_REQUEST');
        }
        if(items.length === undefined){
            return items.toDTO();
        }
        let itemsDTO = [];
        items.forEach(movie => {
            itemsDTO.push(movie.toDTO())
        });
        return itemsDTO;
    }
    getMovie = async (movieID) => {
        if(!(await this.checkExistingMovie(movieID))){
            throw new Error(`No movie was found matching ID ${movieID}`, 'BAD_REQUEST');
        }
        return await (await this.container.getItemByID(movieID)).toDTO();
    }
    getMovieComments = async (movieID) => {
        if(!(await this.checkExistingMovie(movieID))){
            throw new Error(`No movie was found matching ID ${movieID}`, 'BAD_REQUEST');
        }
        return (await this.container.getItemByID(movieID)).Comments.map(comment => comment.toDTO());
    }
    getMovieContent = async (movieID) => {
        if(!(await this.checkExistingMovie(movieID))){
            throw new Error(`No movie was found matching ID ${movieID}`, 'BAD_REQUEST');
        }
        return await (await this.container.getItemByID(movieID)).getContent();
    }
    createMovie = async ({title, subtitle, synopsis, genre, default_poster, images, videos, release_date, duration, qualification, qualifiers, crew, cast, comments}) => {
        let newMovie = new Movie({
            title: title,
            subtitle: subtitle,
            synopsis: synopsis,
            genre: genre,
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
    addQualification = async(idMovie, qualification) => {
        if(!(await this.checkExistingMovie(idMovie))){
            throw new Error(`No movie was found matching ID ${idMovie}`, 'BAD_REQUEST');
        }
        if(qualification == ""){
            qualification = 0
        }
        else{
            qualification = +qualification;
        }
        let movie = await this.container.getItemByID(idMovie);
        const newComment = {
            user,
            message,
            qualification,
            reviewed: false,
            id: randomUUID()
        }
        movie.addComment(newComment);
        let movieID = await this.container.modifyByID(idMovie, movie.toDTO())
        if(!movieID){
            throw new Error(`There was an error creating the movie`, 'INTERNAL_ERROR') 
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