const tableTemplate = `CREATE TABLE IF NOT EXISTS <%-name%> (<%for(let field of fields){%>\n    <%-field%><%}%>
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
`

const generateCreate = (table:IDatabase) => {
    let fields:string[] = []
    // 字段生成
    table.fields.forEach((field:IDatabaseField) => {
        fields.push(`\`${field.name}\` ${field.type.toUpperCase()}${field.notNull?" NOT NULL":""}${field.autoIncrease?" AUTO_INCREMENT":""} COMMENT '${field.desc}',`)
    })
    // 索引生成
    table.fields.forEach((field:IDatabaseField) => {

    })
    // @ts-ignore
    return ejs.render(tableTemplate, {
        name: table.table,
        fields
    })
}

// 生成MYSQL建表语句
export function GenerateMysqlCreate(tables:string[]):string {
    let res:string[] = []
    tables.forEach(s =>{
        let table:IDatabase = JSON.parse(s)
        res.push(generateCreate(table))
    })
    return res.join("\n")
}