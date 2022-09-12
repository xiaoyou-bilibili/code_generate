declare global {
    class ejs {
        static render: (format:string, data:any) => {}
    }
}