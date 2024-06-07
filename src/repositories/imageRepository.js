import { v2 as cloudinary } from 'cloudinary';
import config from '../config/config.js';

let instance = null;

class ImageRepository{
    constructor() {
        cloudinary.config({ 
            cloud_name: config.CLOUDINARY_NAME,
            api_key: config.CLOUDINARY_API,
            api_secret: config.CLOUDINARY_SECRET
        });
    }
    save = async (file) => {
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        return await cloudinary.uploader.upload(dataURI,
            {
                resource_type: "auto",
            });
    }
    deleteByID = async (fileID) => {
        return await cloudinary.uploader.destroy(fileID);
    }
    static getInstance(){
        if(!instance){
            instance = new ImageRepository();
        }
        return instance;
    }
}
export default ImageRepository.getInstance();