import { Error } from "../error/error.js";
import jwt from 'jsonwebtoken';
import { ObjectId } from "bson";
import config from '../config/config.js';
import User from "../models/user.js";
import userRepository from "../repositories/userRepository.js";
import sessionRepository from "../repositories/sessionRepository.js";
import imageRepository from "../repositories/imageRepository.js";

let instance = null;

class UserService{
    constructor(){
        this.container = userRepository;
        this.sessionContainer = sessionRepository;
        this.imageContainer = imageRepository;
    }
    googleSignInAuth = async (token) => {
        const options = {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        let data = await fetch('https://www.googleapis.com/userinfo/v2/me', options)
        let information = await data.json();
        if(information.error !== undefined){
            throw new Error(`Google Authentication token is expired or invalid`, 'UNAUTHORIZED')
        }
        return information;
    }
    createSession = (id, jwt) => {
        let session = {
            userID: new ObjectId(id),
            jwt: jwt,
            expirationDate : new Date(Date.now() + config.SESSION_EXPIRY_TIME * 1000)
        }
        return session;
    }
    createJWT = ({id, nickname}) => {
        const secretKey = config.SECRET_KEY;
        const payload = {
            userId: id,
            username: nickname,
            iat: Math.floor(Date.now() / 1000), // timestamp
            exp: Math.floor(Date.now() / 1000) + config.SESSION_EXPIRY_TIME,
        };
        return jwt.sign(payload, secretKey)
    }
    authUser = async (token) => {
        if(token === undefined || token === null)
            throw new Error(`Google Authentication token is required to perform this action`, 'UNAUTHORIZED')
        let information = await this.googleSignInAuth(token);
        let authInfo = {}
        let newUser = !(await this.checkExistingUser(information.email));
        let user;
        if(newUser){
            user = new User({
                firstname: information.given_name,
                lastname: "",
                nickname: information.name,
                email: information.email,
                image: information.picture,
                favorites: [],
                id: new ObjectId()
            })
            let userID = await this.container.save(user)
            user.setID(userID);
        }
        else{
            user = await this.getUser(information.email)
        }
        let jwt = this.createJWT(user)
        let session = this.createSession(user.getID(), jwt);
        await this.sessionContainer.save(session);
        authInfo.email = user.getEmail()
        authInfo.new = newUser;
        authInfo.jwt = jwt;
        return authInfo;
    }
    refreshAuthUser = async (token) => {  
        if(token === undefined || token === null)
            throw new Error(`Google Authentication token is required to perform this action`, 'UNAUTHORIZED')      
        let information = await this.googleSignInAuth(token);
        let userExists = await this.checkExistingUser(information.email)
        if(!userExists){
            throw new Error(`The server could not validate the credentials`, 'FORBIDDEN')
        }
        let user = await this.getUser(information.email);
        let newJWT = this.createJWT(user);
        let session = this.createSession(user.getID(), newJWT);
        await this.sessionContainer.save(session);
        let authInfo = {}
        authInfo.email = user.getEmail()
        authInfo.jwt = newJWT;
        return authInfo;
    }
    validateJWT = async(token) => {
        return await this.sessionContainer.getItemByCriteria({jwt: token});
    }
    logOutUser = async(token) => {
        let id = await this.validateJWT(token)
        if(!id){
            return;
        }
        let count = await this.sessionContainer.deleteByID(id)
        if(count == 0) {
            throw new Error(`There was an error deleting the session`, 'INTERNAL_ERROR')
        }
    }
    getUserInformation = async (token) => {
        let session = await this.validateJWT(token);
        let user = await this.container.getItemByID(session.userID)
        if(!user){
            throw new Error(`No user was found with the JWT ${token}`, 'NOT_FOUND');
        }
        return user.toDTO();
    }
    getUser = async (email) => {
        return await this.container.getItemByCriteria({email: email})
    }
    checkExistingUser = async (email) => {
        let userFound = await this.getUser(email);
        return (userFound !== null && userFound.length !== 0)
    }
    updateUser = async (userID, user) => {
        let {email, nickname, firstname, lastname} = user;
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
            image: userData.getImage(),
            favorites: userData.getFavorites(),
            id: userID
        })
        await this.container.modifyByID(userID, newUser)
    }
    updateUserImage = async (userID, image) => {
        let userData = await this.container.getItemByID(userID);
        let userFound = (userData !== null)
        if(!userFound){
            throw new Error(`The specified user could not be found ${userID}`, 'CONFLICT');
        }
        let newImageURL = await imageRepository.save(image);
        let oldImage = userData.getImage();
        const urlObject = new URL(oldImage);
        let oldImageID = urlObject.pathname.split('/').slice(-1)[0].split('.')[0];
        await imageRepository.deleteByID(oldImageID)
        let newUser = new User({
            firstname: userData.getFirstname(),
            lastname: userData.getLastname(),
            email: userData.getEmail(),
            nickname: userData.getNickname(),
            image: newImageURL.secure_url,
            favorites: userData.getFavorites(),
            id: userID
        })
        await this.container.modifyByID(userID, newUser);
        return newUser.getImage();
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
        return await this.getUserFavoriteMovies(userID);
    }
    removeMovieFromUserFavorites = async (userID) => {
        let userData = await this.container.getItemByID(userID, movieID);
        let userFound = (userData !== null)
        if(!userFound){
            throw new Error(`The specified user could not be found ${userID}`, 'CONFLICT');
        }
        userData.removeFavorite(movieID);
        await this.container.modifyByID(userID, userData);
        return await this.getUserFavoriteMovies(userID);
    }
    static getInstance(){
        if(!instance){
            instance = new UserService();
        }
        return instance;
    }
}
export default UserService.getInstance();