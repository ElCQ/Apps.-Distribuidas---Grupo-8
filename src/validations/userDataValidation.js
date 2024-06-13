import { Error } from "../error/error.js";
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function userDataValidation({email, nickname, firstname, lastname}) {
    if(nickname === ""  || nickname === undefined){
        throw new Error(`The user nickname can not be empty.`, 'BAD_REQUEST')
    }
    if(email === ""  || email === undefined){
        throw new Error(`The user email can not be empty.`, 'BAD_REQUEST')
    }
    if(!re.test(email)){
        throw new Error(`The user email format is incorrect.`, 'BAD_REQUEST')
    }
    if(firstname === ""  || firstname === undefined){
        throw new Error(`The user firstname can not be empty.`, 'BAD_REQUEST')
    }
    if(lastname === ""  || lastname === undefined){
        throw new Error(`The user lastname can not be empty.`, 'BAD_REQUEST')
    }
}