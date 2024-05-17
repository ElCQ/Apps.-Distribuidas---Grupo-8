import { Error } from "../error/error.js";

export default function movieDataValidation({title, subtitle, synopsis, default_poster, images, videos, release_date, duration, qualification, qualifiers, crew, cast}) {
    if(title === ""){
        throw new Error(`The movie message can not be empty.`, 'BAD_REQUEST')
    }
    if(subtitle === ""){
        throw new Error(`The movie subtitle can not be empty.`, 'BAD_REQUEST')
    }
    if(synopsis === ""){
        throw new Error(`The movie synopsis can not be empty.`, 'BAD_REQUEST')
    }
    if(default_poster === ""){
        throw new Error(`The movie default poster can not be empty.`, 'BAD_REQUEST')
    }
    if(images.length <= 0){
        throw new Error(`The movie images list can not be empty.`, 'BAD_REQUEST')
    }
    if(videos.length <= 0){
        throw new Error(`The movie videos list can not be empty.`, 'BAD_REQUEST')
    }
    if(release_date === ""){
        throw new Error(`The movie release date can not be empty.`, 'BAD_REQUEST')
    }
    if(isNaN(duration)){
        throw new Error(`The movie duration must be a number.`, 'BAD_REQUEST')
    }
    if(+duration < 0){
        throw new Error(`The movie duration can not be negative.`, 'BAD_REQUEST')
    }
    if(isNaN(qualification)){
        throw new Error(`The movie qualification must be a number.`, 'BAD_REQUEST')
    }
    if(+qualification < 0){
        throw new Error(`The movie qualification can not be negative.`, 'BAD_REQUEST')
    }
    if(isNaN(qualifiers)){
        throw new Error(`The movie qualifiers must be a number.`, 'BAD_REQUEST')
    }
    if(+qualifiers < 0){
        throw new Error(`The movie qualifiers can not be negative.`, 'BAD_REQUEST')
    }
    if(crew.length <= 0){
        throw new Error(`The movie crew list can not be empty.`, 'BAD_REQUEST')
    }
    if(cast.length <= 0){
        throw new Error(`The movie cast list can not be empty.`, 'BAD_REQUEST')
    }
}