import { Error } from "../error/error.js";
import Comment from "../models/comment.js";
import commentRepository from "../repositories/commentRepository.js";

let instance = null;

class CommentService{
    constructor(){
        this.container = commentRepository;
    }
    createComment = async (name) => {
        let newComment = new Comment({name: name});
        let commentID = await this.container.save(newComment);
        if(!commentID){
            throw new Error(`There was an error creating the comment`, 'INTERNAL_ERROR') 
        }
        return commentID;
    }
    static getInstance(){
        if(!instance){
            instance = new CommentService();
        }
        return instance;
    }
}
export default CommentService.getInstance();