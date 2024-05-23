import Movie from '../models/movie.js';
import Image from '../models/image.js'
import { ObjectId } from 'mongodb';
import MongoDBContainer from "../containers/mongoDBContainer.js";

let instance = null;

class MovieRepository {
    #dao
    constructor() {
        this.#dao = new MongoDBContainer("movies");
    }
    parseItems(moviesDTOs){
        let parsedMovies = [];
        moviesDTOs.forEach((movie)=>{
            movie.images = movie.images.map(image => {return new Image(image)})
            movie.default_poster = new Image(movie.default_poster)
            parsedMovies.push(new Movie(movie));
        })
        return parsedMovies;
    }
    async save(movie) {
        return await this.#dao.save(movie.toDTO());
    }
    async getItemByID(id) {
        const dto = await this.#dao.getItemByID(id)
        if (!dto) return null
        dto.images.map(image => new Image(image))
        dto.default_poster = new Image(dto.default_poster)
        return new Movie(dto)
    }
    async getItemsByQuantityAndPageAndSortCriteria(quantity, page, sortCriteria){
        let moviesDTOs = await this.#dao.getItemsByQuantityAndPageAndSortCriteria(quantity, page, sortCriteria);
        if (!moviesDTOs) return null
        if (moviesDTOs.length === 1 || moviesDTOs.length === undefined) {
            let movie = moviesDTOs[0]
            movie.images = movie.images.map(image => {return new Image(image)})
            movie.default_poster = new Image(movie.default_poster)
            return new Movie(movie);
        }
        else{
            return this.parseItems(moviesDTOs);
        }
    }
    async getItemByCriteria(criteria) {
        const dtos = await this.#dao.getItemByCriteria(criteria)
        if (!dtos) return null
        if (dtos.length === undefined) return new Movie(dtos);
        if (dtos.length === 1) {
            let movie = dtos[0]
            movie.images = movie.images.map(image => {return new Image(image)})
            movie.default_poster = new Image(movie.default_poster)
            return new Movie(movie);
        }
        else{
            return this.parseItems(dtos);
        }
    }
    async getMoviesByGenre(categoryID) {
        const dtos = await this.#dao.getItemByReferenceID("genres", categoryID)
        if (!dtos) return null
        if (dtos.length === undefined) return new Movie(dtos);
        if (dtos.length === 1) {
            let movie = dtos[0]
            movie.images = movie.images.map(image => {return new Image(image)})
            movie.default_poster = new Image(movie.default_poster)
            return new Movie(movie);
        }
        else{
            return this.parseItems(dtos);
        }
    }
    async modifyByID(id, newMovie){
        let updateInfo = {
            title: newMovie.title,
            subtitle: newMovie.subtitle,
            synopsis: newMovie.synopsis,
            genre: ObjectId(newMovie.genre.id),
            default_poster: newMovie.default_poster,
            images: newMovie.images,
            videos: newMovie.videos,
            release_date: newMovie.release_date,
            duration: newMovie.duration,
            qualification: newMovie.qualification,
            qualifiers: newMovie.qualifiers,
            crew: newMovie.crew,
            cast: newMovie.cast,
            comments: newMovie.comments
        }
        return await this.#dao.modifyByID(id, updateInfo);
    }
    static getInstance(){
        if(!instance){
            instance = new MovieRepository();
        }
        return instance;
    }
}
export default MovieRepository.getInstance();