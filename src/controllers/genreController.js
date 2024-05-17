import genreService from '../services/genreService.js';
import logger from '../utils/logger.js';

let instance = null;

class GenreController{
    getAllGenres = async (req, res, next) => {
        try{
            let items = await genreService.getAllItems();
            logger.info(`GET REQUEST successful for all genres`);
            res.status(200).json(items);
        }
        catch(error){
            next(error);
        }
    }
    checkExistingGenre = async (genreID) => {
        let genreFound = await this.container.getItemByID(genreID);
        return (genreFound !== null && genreFound.length !== 0);
    }
    getGenre = async (genreID) => {
        let genreFound = await this.container.getItemByID(genreID);
        if(!(genreFound !== null && genreFound.length !== 0)){
            throw new Error(`No genre was found matching ID ${genreID}`, 'BAD_REQUEST');
        }
        return genreFound
    }
    static getInstance(){
        if(!instance){
            instance = new GenreController();
        }
        return instance;
    }
}
export default GenreController.getInstance();