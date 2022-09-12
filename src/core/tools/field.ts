// 名称替换，下划线转换为大小写
export const variableUnder2Low = (name: string):string => {
    return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}