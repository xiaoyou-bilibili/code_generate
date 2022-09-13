type fieldType = "tinyint" | "int" | "bigint" | "float" | "double" | "datetime" | "varchar(255)" | "text" | "json"

interface IDatabaseField {
    name: string // 字段名称
    type: fieldType // 字段类型
    desc: string // 字段描述
    notNull: boolean // 不为空
    primary: boolean // 主键
    index: boolean // 索引
    autoIncrease: boolean // 自增
}

interface IDatabase {
    id: string                  // 唯一ID
    table: string           // 数据库表名
    desc: string                // 表描述
    fields: IDatabaseField[]    // 数据库字段
}