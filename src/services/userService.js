import { Error } from "../error/error.js";
import jwt from 'jsonwebtoken';
import { ObjectId } from "bson";
import User from "../models/user.js";
import userRepository from "../repositories/userRepository.js";
import sessionRepository from "../repositories/sessionRepository.js";

let instance = null;

class UserService{
    constructor(){
        this.container = userRepository;
        this.sessionContainer = sessionRepository;
    }
    createSession = (id, jwt) => {
        let session = {
            userID: id,
            jwt: jwt,
            exp: 60*60 //TODO check with config/env variable, 1h for now
        }
        return session;
    }
    createJWT = ({id, nickname}) => {
        const secretKey = "randomteststring"; //TODO check with config/env variable
        const payload = {
            userId: id,
            username: nickname,
            iat: Math.floor(Date.now() / 1000), // timestamp
            exp: Math.floor(Date.now() / 1000) + (60 * 60), //TODO check with config/env variable, 1h for now
        };
        return jwt.sign(payload, secretKey)
    }
    authUser = async (token) => {
        let information = googleSignInAuth(token); //TODO implement google sign in
        let authInfo = {}
        let newUser = !checkExistingUser(information.email);
        let user;
        if(newUser){
            user = new User({
                name: information.firstname,
                lastname: information.lastname,
                nickname: "",
                email: information.email,
                image: information.image,
                favorites: [],
                id: new ObjectId()
            })
            let userID = this.container.save(user)
            user.setID(userID);
        }
        else{
            user = getUser(information.email)
        }
        let jwt = createJWT(user)
        let session = createSession(user.getID(), jwt);
        await this.sessionContainer.save(session);
        authInfo.email = user.getEmail()
        authInfo.new = newUser;
        authInfo.jwt = jwt;
        return authInfo;
    }
    refreshAuthUser = async (token) => {        
        let information = googleSignInAuth(token); //TODO implement google sign in
        let userExists = await this.container.checkExistingUser(information.email)
        if(!userExists){
            throw new Error(`The server could not validate the credentials`, 'FORBIDDEN')
        }
        let user = await getUser(information.email);
        let newJWT = this.createJWT(user);
        let session = this.createSession(user.getID(), newJWT);
        await this.sessionContainer.save(session);
        let authInfo = {}
        authInfo.email = user.getEmail()
        authInfo.jwt = jwt;
        return authInfo;
    }
    validateJWT = async(token) => {
        return await this.sessionContainer.getItemByCriteria({jwt: token});
    }
    logOutUser = async(token) => {
        let id = validateJWT(token)
        if(!id){
            return;
        }
        let count = await this.sessionContainer.deleteByID(id)
        if(count == 0) {
            throw new Error("There was an error deleting the session", 'INTERNAL_ERROR')
        }
    }
    getUserInformation = async (token) => {
        let session = validateJWT(token); //TODO implement google sign in
        let user = await this.container.getItemByID(session.userID)
        if(!user){
            throw new Error(`No user was found with the google token ${token}`, 'NOT_FOUND');
        }
        return user.toDTO();
    }
    getUser = async (email) => {
        return await this.container.getItemByCriteria({email: email})
    }
    checkExistingUser = async (email) => {
        let userFound = await getUser(email);
        return (userFound !== null && userFound.length !== 0)
    }
    updateUser = async (userID, user) => {
        //TODO create userDataValidation(user);
        let {email, nickname, firstname, lastname, image, favorites} = user;
        let userData = await this.container.getItemByID(userID);
        let userFound = (userData !== null)
        if(!userFound){
            throw new Error(`The specified user could not be found ${userID}`, 'CONFLICT');
        }
        let newUser = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            nickname: nickname,
            image: image,
            favorites: favorites,
            id: userID
        })
        await this.container.modifyByID(userID, newUser)
    }
    deleteUser = async (userID) => {
        let userData = await this.container.getItemByID(userID);
        let userFound = (userData !== null)
        if(!userFound){
            throw new Error(`The specified user could not be found ${userID}`, 'CONFLICT');
        }
        await this.container.deleteByID(userID)
    }
    getUserFavoriteMovies = async (userID) => {
        let userData = await this.container.getItemByID(userID, movieID);
        let userFound = (userData !== null)
        if(!userFound){
            throw new Error(`The specified user could not be found ${userID}`, 'CONFLICT');
        }
        let favoritesParsed = []
        let favorites = userData.getFavorites();
        for (let index = 0; index < favorites.length; index++) {
            const movie = movieService.getMovie(favorites[index]);
            favoritesParsed.push(movie);
        }
        return favoritesParsed;
    }
    addMovieToUserFavorites = async (userID) => {
        let userData = await this.container.getItemByID(userID, movieID);
        let userFound = (userData !== null)
        if(!userFound){
            throw new Error(`The specified user could not be found ${userID}`, 'CONFLICT');
        }
        userData.addFavorite(movieID);
        await this.container.modifyByID(userID, userData);
        return await getUserFavoriteMovies(userID);
    }
    removeMovieFromUserFavorites = async (userID) => {
        let userData = await this.container.getItemByID(userID, movieID);
        let userFound = (userData !== null)
        if(!userFound){
            throw new Error(`The specified user could not be found ${userID}`, 'CONFLICT');
        }
        userData.removeFavorite(movieID);
        await this.container.modifyByID(userID, userData);
        return await getUserFavoriteMovies(userID);
    }
    static getInstance(){
        if(!instance){
            instance = new UserService();
        }
        return instance;
    }
}
export default UserService.getInstance();