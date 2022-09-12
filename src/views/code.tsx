import * as monaco from "monaco-editor";
import {useCallback, useEffect, useState} from "react";
import {Space, Transfer, Button} from '@douyinfe/semi-ui';
import {GetAllData} from "../core/tools/db";
import {GenerateRpcCode} from "../core/parse/rpc";
import {GenerateHttpCode} from "../core/parse/http";

let editor: monaco.editor.IStandaloneCodeEditor;

export default function Code() {
    // 所有数据
    let [dataSource, setDataSource] = useState([])
    // 选中的值
    let [selectItem, setSelectItem] = useState([])

    // 初始化所有的接口
    const initApi = () => {
        GetAllData().then((data: any)=>{
            let res:any = []
            data.forEach((item: ICode) => {
                res.push({
                    label: `[${item.method}] ${item.url} (${item.desc})`,
                    value: JSON.stringify(item),
                    disabled: false,
                    key: item.id,
                })
            })
            setDataSource(res)
        })
    }

    // 页面初始化
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
        initApi()
    }, [])
    useEffect(() => viewInit(), [viewInit])

    return <div>
        <Space style={{margin: 5}}>
            <Transfer
                // @ts-ignore
                onChange={(values, items) => setSelectItem(values)}
                style={{height: 300}}
                dataSource={dataSource}
            ></Transfer>
            <div>
                <Button onClick={() => {editor.setValue(GenerateHttpCode(selectItem))}} theme='light' type='primary' style={{ marginRight: 8 }}>Gin 路由与接口代码生成</Button>
                <Button onClick={() => {editor.setValue(GenerateRpcCode(selectItem))}} theme='light' type='primary' style={{ marginRight: 8 }}>RPC 代码生成</Button>
            </div>
        </Space>
        <div id={"viewEditBox"}  style={{height: "700px"}} />
    </div>
}