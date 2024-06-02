import userService from '../services/userService.js';
import imageService from '../services/imageService.js';
import logger from '../utils/logger.js';
import userDataValidation from '../validations/userDataValidation.js';

let instance = null;

class UserController{
    postAuthUser = async (req, res, next) => {
        try{
            let userLogged = await userService.authUser(req.headers.authorization);
            if (userLogged.new){
                logger.info(`POST REQUEST successful for registering user with email ${userLogged.email}`);
                res.status(201).json(userLogged.jwt);
            }
            else{
                logger.info(`POST REQUEST successful for logging in user with email ${userLogged.email}`);
                res.status(200).json(userLogged.jwt);
            }
        }
        catch(error){
            next(error);
        }
    }
    putRefreshAuth = async (req, res, next) => {
        try{
            let userLogged = await userService.refreshAuthUser(req.headers.authorization);
            logger.info(`PUT REQUEST successful for refreshing token for user with email ${userLogged.email}`);
            res.status(200).json(userLogged.jwt);
        }
        catch(error){
            next(error);
        }
    }
    deleteLogOutUser = async (req, res, next) => {
        try{
            await userService.logOutUser(req.headers.authorization);
            logger.info(`POST REQUEST successful for logging out user`);
            res.status(200).json({statusCode: 200, message: `User logged out successfully`});
        }
        catch(error){
            next(error);
        }
    }
    getCurrentUser = async (req, res, next) => {
        try{
            let userInformation = await userService.getUserInformation(req.headers.authorization);
            logger.info(`GET REQUEST successful for getting the information of user ${userInformation.email}`);
            res.status(200).json(userInformation);
        }
        catch(error){
            next(error);
        }
    }
    postUpdateUser = async (req, res, next) => {
        try{
            let userInformation = await userService.getUserInformation(req.headers.authorization);
            userDataValidation(req.body);
            let userInformationModified = await userService.updateUser(userInformation.id, req.body);
            logger.info(`POST REQUEST successful for updating the user ${userInformation.id}`);
            res.send(200).status(userInformationModified);
        }
        catch(error){
            next(error);
        }
    }
    deleteUser = async (req, res, next) => {
        try{
            let userInformation = await userService.getUserInformation(req.headers.authorization);
            await userService.deleteUser(userInformation.id);
            logger.info(`DELETE REQUEST successful for deleting the user ${userInformation.id}`);
            res.sendStatus(200);
        }
        catch(error){
            next(error);
        }
    }
    getCurrentUserFavorites = async (req, res, next) => {
        try{
            let userInformation = await userService.getUserInformation(req.headers.authorization);
            let favoriteMovies = await userService.getUserFavoriteMovies(userInformation.id);
            logger.info(`GET REQUEST successful for user ${userInformation.id} favorite movies`);
            res.status(200).json(favoriteMovies);
        }
        catch(error){
            next(error);
        }
    }
    postMovieToCurrentUserFavorites = async (req, res, next) => {
        try{
            let userInformation = await userService.getUserInformation(req.headers.authorization);
            let favoriteMovies = await userService.addMovieToUserFavorites(userInformation.id, req.params.id);
            logger.info(`GET REQUEST successful for user ${userInformation.id} favorite movies`);
            res.status(200).json(favoriteMovies);
        }
        catch(error){
            next(error);
        }
    }
    deleteMovieFromCurrentUserFavorites = async (req, res, next) => {
        try{
            let userInformation = await userService.getUserInformation(req.headers.authorization);
            let favoriteMovies = await userService.removeMovieFromUserFavorites(userInformation.id, req.params.id);
            logger.info(`GET REQUEST successful for user ${userInformation.id} favorite movies`);
            res.status(200).json(favoriteMovies);
        }
        catch(error){
            next(error);
        }
    }
    putImage = async (req, res, next) => {
        try{
            if(req instanceof Error){
                throw new Error('Failed to upload image to multer', 'INTERNAL_ERROR');
            }
            const cloudResponse = await imageService.uploadToCloud(req.file);
            logger.info(`POST REQUEST successful for image`);
            res.status(200).json(cloudResponse.secure_url);
        }
        catch(error){
            next(error)
        }
    }
    static getInstance(){
        if(!instance){
            instance = new UserController();
        }
        return instance;
    }
}
export default UserController.getInstance();