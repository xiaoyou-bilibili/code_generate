import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {Layout, Nav} from "@douyinfe/semi-ui";
import { IconCode,IconBrackets, IconKey, IconHash } from '@douyinfe/semi-icons';
import Api from "./views/api";
import Code from "./views/code";
import {useState} from "react";
import Database from "./views/database";
import Crud from "./views/crud";

function App() {
    const [selectKey, setSelectKey] = useState(['api'])
    const { Sider, Content } = Layout;

    return (
    <Router>
        <Layout className="components-layout-demo">
            <Sider>
                <Nav
                    bodyStyle={{ height: 320 }}
                    selectedKeys={selectKey}
                    items={[
                        { itemKey: 'api', text: <Link to="/">接口定义</Link>, icon: <IconBrackets /> },
                        { itemKey: 'code', text: <Link to="/code">代码生成</Link>, icon: <IconCode /> },
                        { itemKey: 'database', text: <Link to="/database">数据库定义</Link>, icon: <IconKey /> },
                        { itemKey: 'crud', text: <Link to="/crud">CRUD代码生成</Link>, icon: <IconHash /> },
                    ]}
                    // @ts-ignore
                    onSelect={data => setSelectKey(data.selectedKeys)}
                    footer={{collapseButton: true}}
                />
            </Sider>
            <Layout>
                <Content style={{margin: "10px"}}><Routes>
                    <Route path="/" element={<Api />} />
                    <Route path="/code" element={<Code />} />
                    <Route path="/database" element={<Database />} />
                    <Route path="/crud" element={<Crud />} />
                </Routes></Content>
            </Layout>
        </Layout>


    </Router>
  )
}

export default App
