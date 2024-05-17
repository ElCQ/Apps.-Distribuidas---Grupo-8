import commentService from '../services/commentService.js';
import logger from '../utils/logger.js';

let instance = null;

class CommentController{
    postComment = async (req, res, next) => {
        try{
            //TODO add comment validation
            let comment = await commentService.createComment(req.body);
            logger.info(`POST REQUEST successful for comment ${comment.id}`);
            res.status(200).json(comment);
        }
        catch(error){
            next(error);
        }
    }
    static getInstance(){
        if(!instance){
            instance = new CommentController();
        }
        return instance;
    }
}
export default CommentController.getInstance();