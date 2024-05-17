class Comment{
    #id
    #userId
    #movieId
    #date
    #qualification
    #message
    constructor({message, userId, movieId, date, qualification, id}){
        this.#message = message;
        this.#userId = userId;
        this.#movieId = movieId;
        this.#date = date;
        this.#qualification = qualification;
        this.#id = id;
    }
    getMessage(){
        return this.#message;
    }
    setMessage(message){
        this.#message = message;
    }
    getUserID(){
        return this.#userId;
    }
    setUserID(userId){
        this.#userId = userId;
    }
    getMovieID(){
        return this.#movieId;
    }
    setMovieID(movieId){
        this.#movieId = movieId;
    }
    getDate(){
        return this.#date;
    }
    setDate(date){
        this.#date = date;
    }
    getQualification(){
        return this.#qualification;
    }
    setQualification(qualification){
        this.#qualification = qualification;
    }
    getID(){
        return this.#id;
    }
    setID(id){
        this.#id = id;
    }
    toDTO(){
        const dto = {
            message: this.#message,
            userId: this.#userId,
            movieId: this.#movieId,
            date: this.#date,
            qualification: this.#qualification,
            id: this.#id
        }
        return dto
    }
}
export default Comment;