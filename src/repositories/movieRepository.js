import Movie from '../models/movie.js';
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
        return new Movie(dto)
    }
    async getAllItems(){
        let moviesDTOs = await this.#dao.getAllItems();
        if (!moviesDTOs) return null
        if (moviesDTOs.length === 1 || moviesDTOs.length === undefined) {
            return new Movie(moviesDTOs[0])
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
            return new Movie(dtos[0]);
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
            return new Movie(dtos[0]);
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