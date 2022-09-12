// api定义
import {firstUpperCase, objectExtra, variableUnder2Low} from "../tools/field";

const api = `// <%- desc %>
r.<%- method %>("<%- url %>", <%- fun %>)`
// 函数与swag定义
const swag = `
// <%- fun %>
// @Summary      <%- desc %>
// @Description
// @Tags         <%- tag %><% for (let field of fields) { %>\n// @Param        <%- field %><% } %>
// @Success      200  {object}  BaseResponse{data=<%- fun%>Resp}
// @Router       <%- url %> [<%- method %>]
func <%- fun %>(c *gin.Context) {

}
`
//  结构体定义
const struct = `type <%- name %> struct {<% for (let field of fields) { %>\n    <%- field %><% } %>\n}\n`

// go常用结构体转换
const goTypeChange = (type:string):string => {
    const typeMap:Map<string, string> = new Map([
        ["string", "string"],
        ["i32", "int32"],
        ["i64", "int64"],
        ["bool", "bool"],
        ["double", "float64"],
        ["json", "interface{}"],
    ])

    return typeMap.get(type) || type
}

// html的结构体转换
const htmlTypeChange = (type:string):string => {
    const typeMap:Map<string, string> = new Map([
        ["string", "string"],
        ["i32", "int"],
        ["i64", "int"],
        ["bool", "bool"],
        ["json", "object"],
    ])

    return typeMap.get(type) || type
}

// 生成http路由
const generateSwag = (code:ICode):string => {
    let fields:string[] = []
    // 首先解析header
    code.header.forEach((field:IField) =>{
        fields.push(`${field.field} header ${field.type} ${field.require?'true':'false'} "${field.desc}"`)
    })
    // 如果是GET请求那么就需要把所有的参数都解析出来
    if (code.method === 'get') {
        code.req.forEach((field:IField) => {
            fields.push(`${field.field} query ${htmlTypeChange(field.type)} ${field.require ? 'true' : 'false'} "${field.desc}"`)
        })
    } else {
        // 否则可以看成是body
        fields.push(`default body ${htmlTypeChange(code.other.method)}Req true "请求参数"`)
    }
    // @ts-ignore
    return ejs.render(swag, {
        fun: code.other.method,
        desc: code.desc,
        tag: code.other.tag,
        url: code.url,
        method: code.method,
        fields
    });
}

// 生成结构体
const generateStruct = (name:string,fields:IField[]):string => {
    let res = ''
    // 提取出所有的变量
    let allField = objectExtra(name, fields)
    console.log(fields)
    // 遍历所有字段
    allField.forEach((value,name) => {
        let fields = []
        for (let i = 0; i < value.length; i++) {
            let f = value[i]
            // Name string `json:"name"`
            fields.push(`${firstUpperCase(variableUnder2Low(f.field))} ${goTypeChange(f.type)} \`json:"${f.string?'string,':''}${f.field}"\` // ${f.desc}`)
        }
        // @ts-ignore
        res+=ejs.render(struct, {name, fields})
    })
    return res
}

export function GenerateHttpCode(codes:string[]):string {
    let methods:string[] = []
    let swagList:string[] = []
    let structList:string[] = []
    codes.forEach(s => {
        let code = JSON.parse(s)
        // 生成路由信息
        // @ts-ignore
        methods.push(ejs.render(api, {desc: code.desc, method: code.method.toUpperCase(), url: code.url, fun: code.other.method}))
        // 生成swag相关信息
        swagList.push(generateSwag(code))
        // 生成req和resp
        let req = generateStruct(`${code.other.method}Req`, code.req)
        let res = generateStruct(`${code.other.method}Resp`, code.resp)
        structList.push(req+res)
    })
    // 最后只需要组装一下就可以了
    return `${methods.join("\n")}\n\n${swagList.join("\n")}\n\n${structList.join("\n")}`
}