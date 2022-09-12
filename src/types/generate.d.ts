type fieldType = "string" | "i32" | "i64" | "object" | "bool" | "double" | string
type methodType = "get" | "post" | "put" | "delete" | ""
interface IField {
    field: string
    type: fieldType
    require: boolean
    desc: string
    fieldName: string
    string: boolean
}
interface IOther {
    method: string
    rpcModule: string
    tag: string
}

interface ICode {
    id: string
    method: methodType
    url: string
    desc: string
    header: IField[]
    req: IField[]
    resp: IField[]
    other: IOther
}
