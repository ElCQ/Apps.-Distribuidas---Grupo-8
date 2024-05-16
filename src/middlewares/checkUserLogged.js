import { Error } from "../error/error.js";

export default function checkUserLogged(req, res, next) {
    next();//TODO remove when implementation of JWT is done
    if(!req.header.authorization){
        throw new Error('You need to be logged in to perform this action', 'FORBIDDEN')
    }
    //TODO check JWT...
    next();
}