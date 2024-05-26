import MongoDBContainer from "../containers/mongoDBContainer.js";

let instance = null;

class CommentRepository {
    #dao
    constructor() {
        this.#dao = new MongoDBContainer("comments");
    }
    async save(comment) {
        return await this.#dao.save(comment.toDTO());
    }
    static getInstance(){
        if(!instance){
            instance = new CommentRepository();
        }
        return instance;
    }
}
export default CommentRepository.getInstance();