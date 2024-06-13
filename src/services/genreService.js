import { Error } from "../error/error.js";
import genreRepository from "../repositories/genreRepository.js";

let instance = null;

class GenreService{
    constructor(){
        this.container = genreRepository;
    }
    getAllItems = async () => {
        let items = await this.container.getAllItems();
        if(items < 1){
            throw new Error(`No genre was found`, 'BAD_REQUEST');
        }
        if(items.length === undefined){
            return items.toDTO();
        }
        let itemsDTO = [];
        items.forEach(genre => {
            itemsDTO.push(genre.toDTO())
        });
        return itemsDTO;
    }
    getGenre = async (genreID) => {
        if(!(await this.checkExistingGenre(genreID))){
            throw new Error(`No genre was found matching ID ${genreID}`, 'BAD_REQUEST');
        }
        return (await this.container.getItemByID(genreID));
    }
    checkExistingGenre = async (genreID) => {
        let genreFound = await this.container.getItemByID(genreID);
        return (genreFound !== null && genreFound.length !== 0);
    }
    static getInstance(){
        if(!instance){
            instance = new GenreService();
        }
        return instance;
    }
}
export default GenreService.getInstance();