import {objectExtra, variableUnder2Low} from "../tools/field";
import {match} from "assert";
// RPC主方法
const rpcMethod = `// <%= desc %>
<%= module %>.<%= method %>Resp <%= method %>(1:required <%= module %>.<%= method %>Req req)`
// 接口定义
const rpcStruct = `struct <%= name %> {<% for (let field of fields) { %>\n   <%= field %><% } %>\n}\n`

// 生成RPC方法的field字段
const generateField = (name:string, fields:IField[]):string => {
    let res = ''
    // 提取出所有的变量
    let allField = objectExtra(name, fields)
    // 遍历所有字段
    allField.forEach((value,name) => {
       let fields = []
       for (let i = 0; i < value.length; i++) {
           let f = value[i]
           fields.push(`${i + 1}:${f.require ? '' : ' optional'} ${f.type} ${variableUnder2Low(f.field)} // ${f.desc}`)
       }
       // @ts-ignore
       res+=ejs.render(rpcStruct, {name, fields})
    })
    return res
}

export function GenerateRpcCode(codes:ICode[]):string {
    let methods:string[] = []
    let dataList:string[] = []
    codes.forEach(code => {
        // 生成RPC方法名
        // @ts-ignore
        let method = ejs.render(rpcMethod, {desc: code.desc, module: code.other.rpcModule, method: code.other.method})
        // 生成RPC各个方法的字段
        let req = generateField(`${code.other.method}Req`, code.req)
        let res = generateField(`${code.other.method}Resp`, code.resp)
        methods.push(method)
        dataList.push(req+res)
    })
    // 最后只需要组装一下就可以了
    return methods.join("\n") + "\n\n" + dataList.join("\n")
}