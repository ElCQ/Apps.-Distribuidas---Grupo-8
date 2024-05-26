import MongoDBContainer from "../containers/mongoDBContainer.js";

let instance = null;

class SessionRepository {
    #dao
    constructor() {
        this.#dao = new MongoDBContainer("sessions", true)
    }
    async save(session) {
        return await this.#dao.save(session);
    }
    async getItemByCriteria(criteria) {
        const dtos = await this.#dao.getItemByCriteria(criteria)
        if (!dtos) return null
        if (dtos.length === undefined) return dtos;
        return dtos[0];
    }
    async deleteByID(id){
        return this.#dao.deleteByID(id)
    }
    static getInstance(){
        if(!instance){
            instance = new SessionRepository();
        }
        return instance;
    }
}
export default SessionRepository.getInstance();