class User{
    #id
    #firstname
    #lastname
    #nickname
    #email
    #image
    #favorites
    constructor({email, nickname, firstname, lastname, image, favorites, id}){
        this.#email = email;
        this.#nickname = nickname;
        this.#firstname = firstname;
        this.#lastname = lastname;
        this.#id = id;
        this.#image = image;
        this.#favorites = favorites;
    }
    getID(){
        return this.#id;
    }
    setID(id){
        this.#id = id;
    }
    getFirstname(){
        return this.#firstname;
    }
    setFirstname(firstname){
        this.#firstname = firstname;
    }
    getLastname(){
        return this.#lastname;
    }
    setLastname(lastname){
        this.#lastname = lastname;
    }
    getNickname(){
        return this.#nickname;
    }
    setNickname(nickname){
        this.#nickname = nickname;
    }
    getEmail(){
        return this.#email;
    }
    setEmail(email){
        this.#email = email;
    }
    getImage(){
        return this.#image;
    }
    setImage(image){
        this.#image = image;
    }
    getFavorites(){
        return this.#favorites;
    }
    setFavorites(favorites){
        this.#favorites = favorites;
    }
    addFavorite(favorite){
        if (!this.#favorites.includes(favorite)) {
            this.#favorites.push(favorite);
        }
    }
    removeFavorite(favorite){
        this.#favorites = this.#favorites.filter(item => item !== favorite);
    }
    modify({email, nickname, firstname, lastname, image, favorites}){
        this.setEmail(email);
        this.setNickname(nickname);
        this.setFirstname(firstname);
        this.setLastname(lastname);
        this.setImage(image);
        this.setFavorites(favorites);
    }
    toDTO(){
        const dto = {
            name: this.#firstname,
            lastname: this.#lastname,
            email: this.#email,
            nickname: this.#nickname,
            image: this.#image,
            favorites: this.#favorites,
            id: this.#id
        }
        return dto
    }
}
export default User;