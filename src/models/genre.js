class Genre{
    #id
    #name
    constructor({name, id}){
        this.#name = name;
        this.#id = id;
    }
    getName(){
        return this.#name;
    }
    setName(name){
        this.#name = name;
    }
    getID(){
        return this.#id;
    }
    setID(id){
        this.#id = id;
    }
    toDTO(){
        const dto = {
            name: this.#name,
            id: this.#id
        }
        return dto
    }
}
export default Genre;