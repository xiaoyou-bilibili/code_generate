export const exportJson = (data:string,name:string) => {
    let link = document.createElement('a')
    link.download = `${name}.json`
    link.href = 'data:text/plain,' + JSON.stringify(data)
    link.click()
}