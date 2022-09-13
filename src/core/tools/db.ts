import {IDBPDatabase, openDB} from 'idb'
import {v4} from "uuid";
const dbName = 'code'
export const storeNameApi = 'api'
export const storeNameDatabase = 'database'

const getDb = ():Promise<IDBPDatabase> => {
    return openDB(dbName, 1, {
        upgrade(db) {
            db.createObjectStore(storeNameApi);
            db.createObjectStore(storeNameDatabase);
        }
    })
}

// 新增数据,返回唯一ID
export const AddData = (data:ICode, table:string=storeNameApi) => {
    return new Promise(async (resolve, reject) => {
        let db = await getDb()
        // 随机生成一个ID
        data.id = v4()
        db.put(table, data, data.id).then(value => {
            resolve(data.id)
        })
    })
}

// 直接获取所有的值
export const GetAllData = (table:string=storeNameApi) => {
    return new Promise(async (resolve, reject) => {
        let db = await getDb()
        let data = await db.getAll(table)
        resolve(data)
    })
}

// 获取某一个值
export const GetData = (id:string, table:string=storeNameApi) => {
    return new Promise(async (resolve, reject) => {
        let db = await getDb()
        let data = await db.get(table, id)
        resolve(data)
    })
}

// 保存数据到数据库
export const SaveData = (id:string, data:any, table:string=storeNameApi) => {
    return new Promise(async (resolve, reject) => {
        let db = await getDb()
        let res = await db.put(table, data, id)
        resolve(res)
    })
}

// 删除数据
export const DeleteData = (id:string, table:string=storeNameApi) => {
    return new Promise(async (resolve, reject) => {
        let db = await getDb()
        let res = await db.delete(table, id)
        resolve(res)
    })
}