import { Error } from "../error/error.js";
import userService from "../services/userService.js";

export default async function checkUserLogged(req, res, next) {
    if(!req.headers.authorization){
        next(new Error('You need to be logged in to perform this action', 'FORBIDDEN'))
        return;
    }
    let session = await userService.validateJWT(req.headers.authorization);
    if(!session){
        next(new Error('You need to be logged in to perform this action', 'FORBIDDEN'))
        return;
    }
    next();
}