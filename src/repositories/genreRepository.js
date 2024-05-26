import Genre from '../models/genre.js';
import MongoDBContainer from "../containers/mongoDBContainer.js";

let instance = null;

class GenreRepository {
    #dao
    constructor() {
        this.#dao = new MongoDBContainer("genres");
    }
    parseItems(genresDTOs){
        let parsedGenres = [];
        genresDTOs.forEach((genre)=>{
            parsedGenres.push(new Genre(genre));
        })
        return parsedGenres;
    }
    async getItemByID(id) {
        const dto = await this.#dao.getItemByID(id)
        if (!dto) return null
        return new Genre(dto)
    }
    async getAllItems(){
        let genresDTOs = await this.#dao.getAllItems();
        if (!genresDTOs) return null
        if (genresDTOs.length === 1 || genresDTOs.length === undefined) {
            return new Genre(genresDTOs[0])
        }
        else{
            return this.parseItems(genresDTOs);
        }
    }
    static getInstance(){
        if(!instance){
            instance = new GenreRepository();
        }
        return instance;
    }
}
export default GenreRepository.getInstance();