import { Error } from "../error/error.js";
import userService from "../services/userService.js";

export default function checkUserLogged(req, res, next) {
    if(!req.header.authorization){
        throw new Error('You need to be logged in to perform this action', 'FORBIDDEN')
    }
    let session = userService.validateJWT(req.header.authorization);
    if(!session){
        throw new Error('You need to be logged in to perform this action', 'FORBIDDEN')
    }
    next();
}