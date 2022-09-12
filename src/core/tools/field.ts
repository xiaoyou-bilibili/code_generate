// 名称替换，下划线转换为大小写
export const variableUnder2Low = (name: string):string => {
    return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}

// 多级字段提取
export const objectExtra = (name:string, data: IField[]):Map<string, IField[]> => {
    // 结构体以及结构体对于的类型
    let structs:Map<string, IField[]> = new Map()
    let fieldTypeMap:Map<string, string> = new Map()
    // 第一级字段
    let rootField:IField[] = []
    // 循环遍历提取
    for (let i = 0; i < data.length; i++) {
        let f = data[i]
        // 如果是object那么就需要单独列出一个对象
        if (f.type == 'object') {
            f.type = f.fieldName || ''
            fieldTypeMap.set(f.field, f.type)
        } else if (f.field.indexOf(".") != -1) {
            // 如果字段里面带有.就说明是二级字段，需要额外记录
            let i = f.field.substring(0, f.field.indexOf("."))
            f.field = f.field.substring(f.field.indexOf(".")+1)
            // 获取其对应的结构体
            let fieldType = fieldTypeMap.get(i) || ""
            if (structs.has(fieldType)){
                structs.get(fieldType)?.push(f)
            } else {
                structs.set(fieldType, [f])
            }
            continue
        }
        rootField.push(f)
    }
    // 设置root字段
    structs.set(name, rootField)
    return structs
}