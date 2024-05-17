import { Error } from "../error/error.js";

export default function commentDataValidation({message, userId, movieId, date, qualification}) {
    if(message === ""){
        throw new Error(`The comment message can not be empty.`, 'BAD_REQUEST')
    }
    if(userId === ""){
        throw new Error(`The user ID can not be empty.`, 'BAD_REQUEST')
    }
    if(movieId === ""){
        throw new Error(`The movie ID can not be empty.`, 'BAD_REQUEST')
    }
    if(date === ""){
        throw new Error(`The comment date can not be empty.`, 'BAD_REQUEST')
    }
    if(isNaN(qualification)){
        throw new Error(`The comment qualification must be a number.`, 'BAD_REQUEST')
    }
    if(+qualification < 0){
        throw new Error(`The comment qualification can not be negative.`, 'BAD_REQUEST')
    }
}