import {IDBPDatabase, openDB} from 'idb'
import {v4} from "uuid";
const dbName = 'code'
const storeNameApi = 'api'

const getDb = ():Promise<IDBPDatabase> => {
    return openDB(dbName, 1, {
        upgrade(db) {
            db.createObjectStore(storeNameApi);
        }
    })
}

// 新增数据,返回唯一ID
export const AddData = (data:ICode) => {
    return new Promise(async (resolve, reject) => {
        let db = await getDb()
        // 随机生成一个ID
        data.id = v4()
        db.put(storeNameApi, data, data.id).then(value => {
            resolve(data.id)
        })
    })
}

// 直接获取所有的值
export const GetAllData = () => {
    return new Promise(async (resolve, reject) => {
        let db = await getDb()
        let data = await db.getAll(storeNameApi)
        resolve(data)
    })
}

// 获取某一个值
export const GetData = (id:string) => {
    return new Promise(async (resolve, reject) => {
        let db = await getDb()
        let data = await db.get(storeNameApi, id)
        resolve(data)
    })
}

// 保存数据到数据库
export const SaveData = (id:string,data:any) => {
    return new Promise(async (resolve, reject) => {
        let db = await getDb()
        let res = await db.put(storeNameApi, data, id)
        resolve(res)
    })
}

// 删除数据
export const DeleteData = (id:string) => {
    return new Promise(async (resolve, reject) => {
        let db = await getDb()
        let res = await db.delete(storeNameApi, id)
        resolve(res)
    })
}