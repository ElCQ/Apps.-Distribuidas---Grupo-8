import { mongoDatabase } from '../db/mongoClient.js';
import { ObjectId } from 'mongodb';
export default class MongoDBContainer {
    constructor(dataType, expiracy = false) {
        this.items = mongoDatabase.collection(dataType);
        if(expiracy)
            this.items.createIndex({ expirationDate: 1 }, { expireAfterSeconds: 0 })
    }
    async save(object) {
        delete object.id;//removes the object ID
        return (await this.items.insertOne(object)).insertedId.toString()
    }
    async getItemByID(idItem) {
        let criterio = { _id: new ObjectId(idItem) };
        let item = await this.items.find(criterio).toArray();
        if(!item.toString()){//to check if no doc was found
            return null;
        }
        return (this.parseData(item[0]))
    }
    async getAllItems(){
        let items = await this.items.find({}).toArray();
        if(!items.toString()){//to check if no doc was found
            return null;
        }
        let itemList = []
        items.forEach(item => {
            itemList.push(this.parseData(item))
        });
        return itemList
    }
    async getItems(query, quantity, page, sortCriteria){
        let listOfGenreCriterias = [];
        let listOfQueryCriterias = [];
        if(query.referenceFields.length !== 0){
            listOfGenreCriterias = listOfGenreCriterias.concat(query.referenceFields.map(referenceField => { return {[referenceField.field]: new ObjectId(referenceField.value)}}))
        }
        if(query.value !== ""){ //in case it is blank apply no filter
            listOfQueryCriterias = listOfQueryCriterias.concat(query.fields.map(attribute => { return {[attribute]: { $regex: new RegExp(query.value, 'i') }}}))
            listOfQueryCriterias = listOfQueryCriterias.concat(query.itemFields.map(itemField => {return {[itemField.listName]: { $elemMatch: { [itemField.field]: { $regex: new RegExp(query.value, 'i') } }}}}))
        }
        let genreCriteria = {$or: listOfGenreCriterias};
        let queryCriteria = {$or: listOfQueryCriterias};
        let filter;
        if(listOfGenreCriterias.length === 0 && listOfQueryCriterias.length === 0){
            filter = {}
        }
        else{
            if(listOfGenreCriterias.length === 0){
                filter = queryCriteria
            }
            else{
                if(listOfQueryCriterias.length === 0){
                    filter = genreCriteria
                }
                else{
                    filter = {$and: [genreCriteria, queryCriteria]}
                }
            }
        }
        let items = await this.items.find(filter).sort(sortCriteria).skip((page - 1) * quantity).limit(quantity).toArray();
        if(!items.toString()){//to check if no doc was found
            return null;
        }
        let itemList = []
        items.forEach(item => {
            itemList.push(this.parseData(item))
        });
        return itemList
    }
    async getItemByCriteria(criteria) {
        let item = await this.items.find(criteria).toArray();
        if(item instanceof Array && item.length !== 0) return (this.parseMultipleData(item))
        if(!item.toString()){//to check if no doc was found
            return null;
        }
        return (this.parseData(item))
    }
    async getItemByReferenceID(field, id){
        let criteria = {};
        criteria[field] = new ObjectId(id);
        return this.getItemByCriteria(criteria);
    }
    async modifyByID(idItem, newItemParam){
        delete newItemParam.id;
        let query = await this.items.updateOne({ _id: new ObjectId(idItem) }, { $set: newItemParam });
        return (query.modifiedCount > 0);
    }
    async deleteByID(idItem){
        let criterio = { _id: new ObjectId(idItem) };
        let query = await this.items.deleteOne(criterio);
        return (query.deletedCount > 0);
    }
    parseData(item){//parse _id to id in order to manage the same property 
        let data = {
            id: item._id.toString(), ...item
        }
        delete data._id;
        return data
    }
    parseMultipleData(items){
        return items.map((item) => this.parseData(item))
    }
}
