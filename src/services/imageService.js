import { v2 as cloudinary } from 'cloudinary';
import config from '../config/config.js';

let instance = null;

class ImageService{
    constructor() {
        
        cloudinary.config({ 
            cloud_name: config.CLOUDINARY_NAME,
            api_key: config.CLOUDINARY_API,
            api_secret: config.CLOUDINARY_SECRET
        });
    }
    uploadToCloud = async (file) => {
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        const response = await cloudinary.uploader.upload(dataURI,
            {
                resource_type: "auto",
            });
        return response
    }
    static getInstance(){
        if(!instance){
            instance = new ImageService();
        }
        return instance;
    }
}
export default ImageService.getInstance();