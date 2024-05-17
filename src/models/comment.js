class Comment{
    #id
    #userId
    #date
    #qualification
    #message
    constructor({message, userId, date, qualification, id}){
        this.#message = message;
        this.#userId = userId;
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
            date: this.#date,
            qualification: this.#qualification,
            id: this.#id
        }
        return dto
    }
}
export default Comment;