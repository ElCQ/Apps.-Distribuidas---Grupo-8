import { Error } from "../error/error.js";
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function userDataValidation({email, nickname, firstname, lastname, image}) {
    if(nickname === ""){
        throw new Error(`The user nickname can not be empty.`, 'BAD_REQUEST')
    }
    if(email === ""){
        throw new Error(`The user email can not be empty.`, 'BAD_REQUEST')
    }
    if(re.test(email)){
        throw new Error(`The user email can not be empty.`, 'BAD_REQUEST')
    }
    if(firstname === ""){
        throw new Error(`The user firstname can not be empty.`, 'BAD_REQUEST')
    }
    if(lastname === ""){
        throw new Error(`The user lastname can not be empty.`, 'BAD_REQUEST')
    }
    if(image === ""){
        throw new Error(`The user image can not be empty.`, 'BAD_REQUEST')
    }
}