import imageToBase64 from "image-to-base64"
class Image{
    #id
    #aspect_ratio
    #height
    #width
    #file_path
    constructor({aspect_ratio, height, width, file_path, id}){
        this.#aspect_ratio = aspect_ratio;
        this.#height = height;
        this.#width = width;
        this.#file_path = file_path;
        this.#id = id;
    }
    getAspectRatio(){
        return this.#aspect_ratio;
    }
    setAspectRatio(aspect_ratio){
        this.#aspect_ratio = aspect_ratio;
    }
    getHeight(){
        return this.#height;
    }
    setHeight(height){
        this.#height = height;
    }
    getWidth(){
        return this.#width;
    }
    setWidth(width){
        this.#width = width;
    }
    getFilePath(){
        return this.#file_path;
    }
    setFilePath(file_path){
        this.#file_path = file_path;
    }
    getID(){
        return this.#id;
    }
    setID(id){
        this.#id = id;
    }
    toDTO(){
        const dto = {
            aspect_ratio: this.#aspect_ratio,
            height: this.#height,
            width: this.#width,
            file_path: this.#file_path,
            id: this.#id
        }
        return dto
    }
    async toBase64(){
        const imageUrl = 'https://image.tmdb.org/t/p/original'+this.#file_path
        return await imageToBase64(imageUrl)
    }
}
export default Image;