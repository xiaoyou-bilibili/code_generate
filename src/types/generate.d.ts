type fieldType = "string" | "i32" | "i64" | "object" | "bool" | "double" | string
type methodType = "get" | "post" | "put" | "delete" | ""
interface IField {
    field: string   // 字段名称
    type: fieldType // 字段类型
    require: boolean  // 是否必选
    desc: string    // 字段描述
    fieldName: string   // 字段别名（不填则默认采用字段名称转换为驼峰）
    string: boolean // 是否为string类型，避免前端无法解析
}
interface IOther {
    method: string  // 函数方法
    rpcModule: string   // RPC模块名
    dataModule: string // 结构体所在包
    tag: string // 接口标签
}

interface ICode {
    id: string  // 唯一ID
    method: methodType  // 请求方式
    url: string  // 接口URL
    desc: string  // 接口描述
    header: IField[]    // 接口header字段
    req: IField[]   // 接口body字段
    resp: IField[]  // 接口返回
    other: IOther   // 其他配置
}
