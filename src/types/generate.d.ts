type fieldType = "string" | "i32" | "i64" | "object" | "bool" | "double"
type methodType = "get" | "post" | "put" | "delete" | ""
interface IField {
    field: string
    type: fieldType
    require: boolean
    desc: string
    fieldName?: string
}
interface IOther {
    method: string
    rpcModule: string
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