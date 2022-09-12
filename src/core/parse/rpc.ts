import {variableUnder2Low} from "../tools/field";

interface IFieldRes {
    field: string,
    struct: string
}

// 生成RPC方法的field字段
const generateField = (fields:IField[]):IFieldRes => {
    let field="",struct = ""
    let structs:Map<string, IField[]> = new Map()
    let structsMap:Map<string, string> = new Map()
    for (let i = 0; i < fields.length; i++) {
        let f = fields[i]
        let fieldType: string = f.type
        // 如果是object那么就需要单独列出一个对象
        if (f.type == 'object') {
            fieldType = f.fieldName || ''
            structsMap.set(f.field, fieldType)
        } else if (f.field.indexOf(".") != -1) {
            // 如果字段里面带有.就说明是二级字段，需要额外记录
            let i = f.field.substring(0, f.field.indexOf("."))
            f.field = f.field.substring(f.field.indexOf(".")+1)
            if (structs.has(i)){
                structs.get(i)?.push(f)
            } else {
                structs.set(i, [f])
            }
            continue
        }

        field+= `   ${i+1}:${f.require?'':' optional'} ${fieldType} ${variableUnder2Low(f.field)} // ${f.desc}\n`
    }
    // 拼装其他字符串
    structs.forEach((value, key) => {
        let s = ''
        for (let i = 0; i < value.length; i++) {
            let f = value[i]
            s+= `   ${i+1}:${f.require?'':' optional'} ${f.type} ${variableUnder2Low(f.field)} // ${f.desc}\n`
        }
        struct+= `\nstruct ${structsMap.get(key)} {\n${s}}`
    })
    return {field, struct}
}


export function GenerateRpcCode(code:ICode):string {
    // 生成RPC方法名
    let method = `// ${code.desc} \n${code.other.rpcModule}.${code.other.method}Resp ${code.other.method}(1:required ${code.other.rpcModule}.${code.other.method}Req req)`
    // 生成RPC各个方法的字段
    let reqField = generateField(code.req)
    let resField = generateField(code.resp)
    // 生成req请求
    let req = `${reqField.struct}\nstruct ${code.other.method}Req {\n${reqField.field}\n}`
    // 生成resp请求
    let resp = `${reqField.struct}\nstruct ${code.other.method}Resp {\n${resField.field}\n}`
    return method+req+resp
}