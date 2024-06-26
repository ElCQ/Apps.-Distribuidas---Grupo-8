import User from '../models/user.js';
import MongoDBContainer from "../containers/mongoDBContainer.js";

let instance = null;

class UserRepository {
    #dao
    constructor() {
        this.#dao = new MongoDBContainer("users")
    }
    parseItems(usersDTOs){
        let parsedUsers = [];
        usersDTOs.forEach((user)=>{
            parsedUsers.push(new User(user))
        })
        return parsedUsers;
    }
    async save(user) {
        return await this.#dao.save(user.toDTO());
    }
    async getItemByID(id) {
        const dto = await this.#dao.getItemByID(id)
        if (!dto) return null
        return new User(dto)
    }
    async getItemByCriteria(criteria) {
        const dtos = await this.#dao.getItemByCriteria(criteria)
        if (!dtos) return null
        if (dtos.length === undefined) return new User(dtos);
        if (dtos.length === 1){ 
            return new User(dtos[0]);
        }
        else{
            return this.parseItems(dtos);
        }
    }
    async modifyByID(id, newUser){
        return await this.#dao.modifyByID(id, newUser.toDTO());
    }
    async deleteByID(id){
        return this.#dao.deleteByID(id)
    }
    static getInstance(){
        if(!instance){
            instance = new UserRepository();
        }
        return instance;
    }
}
export default UserRepository.getInstance();