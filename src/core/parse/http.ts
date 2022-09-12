const api = `
<%= people.join(", "); %>
`

// 生成http路由
const generateApi = ():string => {
    let people = ['geddy', 'neil', 'alex']
    // @ts-ignore
    return ejs.render(api, {people: people});
}


export function GenerateHttpCode(codes:string[]):string {
    return generateApi()
}