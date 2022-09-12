import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {Layout, Nav} from "@douyinfe/semi-ui";
import { IconCode,IconBrackets } from '@douyinfe/semi-icons';
import Api from "./views/api";

function App() {
    const { Sider, Content } = Layout;

    return (
    <Router>
        <Layout className="components-layout-demo">
            <Sider>
                <Nav
                    bodyStyle={{ height: 320 }}
                    items={[
                        { itemKey: 'user', text: '接口定义', icon: <IconBrackets /> },
                        { itemKey: 'union', text: '代码生成', icon: <IconCode /> },
                    ]}
                    onSelect={data => console.log('trigger onSelect: ', data)}
                    onClick={data => console.log('trigger onClick: ', data)}
                    footer={{collapseButton: true}}
                />
            </Sider>
            <Layout>
                <Content style={{margin: "10px"}}><Routes>
                    <Route path="/" element={<Api />} />
                </Routes></Content>
            </Layout>
        </Layout>


    </Router>
  )
}

export default App
