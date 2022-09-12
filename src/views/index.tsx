import * as monaco from "monaco-editor";
import {useCallback, useEffect} from "react";
import {GenerateRpcCode} from "../core/parse/rpc";
let editor: monaco.editor.IStandaloneCodeEditor;

export default function Index() {
    let api:ICode = {
        id: '',
        url: 'api/v0/people',
        method: 'post',
        desc: '添加人员信息',
        header: [{field: 'x-token', type: 'string', require: true, desc: 'token信息'}],
        req: [
            {field: 'name', type: 'string', require: true, desc: '姓名'},
            {field: 'age', type: 'i32', require: false, desc: '年龄'},
            {field: 'info', type: 'object', require: true, desc: '信息', fieldName: 'Info'},
            {field: 'info.addr', type: 'string', require: true, desc: '地址'},
            {field: 'info.nickname', type: 'string', require: true, desc: '昵称'}
        ],
        resp: [
            {field: 'status', type: 'string', require: true, desc: '姓名'},
        ],
        other: {
            method: 'AddPeople',
            rpcModule: 'people'
        }
    }

    const viewInit = useCallback(() => {
        monaco.editor.getModels().forEach(model => model.dispose());
        editor = monaco.editor.create(document.getElementById("viewEditBox") as HTMLElement, {
            value: '', // 编辑器初始显示文字
            language: 'json', // 使用JavaScript语言
            automaticLayout: true, // 自适应布局
            theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
            foldingStrategy: 'indentation', // 代码折叠
            renderLineHighlight: 'all', // 行亮
            selectOnLineNumbers: true, // 显示行号
            minimap: {enabled: false}, // 是否开启小地图（侧边栏的那个全览图）
            readOnly: false, // 只读
            fontSize: 18, // 字体大小
            scrollBeyondLastLine: false, // 取消代码后面一大段空白
            overviewRulerBorder: false, // 不要滚动条的边框
        })

        editor.setValue(GenerateRpcCode(api))
    }, [])
    useEffect(() => viewInit(), [viewInit])

    return <div>
        <div id={"viewEditBox"} style={{height: "700px"}} />
    </div>
}