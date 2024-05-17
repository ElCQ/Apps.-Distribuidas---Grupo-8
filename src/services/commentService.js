import { Error } from "../error/error.js";
import Comment from "../models/comment.js";
import commentRepository from "../repositories/commentRepository.js";
import movieService from "./movieService.js";

let instance = null;

class CommentService{
    constructor(){
        this.container = commentRepository;
    }
    createComment = async ({message, userId, movieId, date, qualification}) => {
        let newComment = new Comment({
            message: message,
            userId: userId,
            movieId: movieId,
            date: date,
            qualification: +qualification,
        });
        let commentID = await this.container.save(newComment);
        if(!commentID){
            throw new Error(`There was an error creating the comment`, 'INTERNAL_ERROR') 
        }
        await movieService.addQualification(newComment)
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