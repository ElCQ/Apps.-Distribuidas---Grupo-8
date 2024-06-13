import logger from "../utils/logger.js";

export default function errorHandler(err, req, res, next){
    logger.error(err.message)
    switch (err.type){
        case 'BAD_REQUEST':{
            res.status(400).json({statusCode: 400, message: err.message});;
            break;
        }
        case 'UNAUTHORIZED':{
            res.status(401).json({statusCode: 401, message: err.message});;
            break;
        }
        case 'FORBIDDEN':{
            res.status(403).json({statusCode: 403, message: err.message});;
            break;
        }
        case 'NOT_FOUND':{
            res.status(404).json({statusCode: 404, message: err.message});
            break;
        }
        case 'CONFLICT':{
            res.status(409).json({statusCode: 409, message: err.message});;
            break;
        }
        default: {
            res.status(500).json({statusCode: 500, message: err.message});;
            break;
        }
    }
}