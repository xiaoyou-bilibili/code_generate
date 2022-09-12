import React, {useCallback, useEffect, useState} from 'react';
import {Form, Col, Row, ArrayField, Button, Select as Select2, Space, Toast, Modal, TextArea} from '@douyinfe/semi-ui';
import { IconPlusCircle, IconMinusCircle } from '@douyinfe/semi-icons';
import {AddData, DeleteData, GetAllData, GetData, SaveData} from "../core/tools/db";


export default function Api() {
    // 默认空状态
    let empty: ICode = {id: '', url: '', method: '', desc: '', header: [], req: [], resp: [],
        other: {method: '', rpcModule: ''}
    }
    // 一些状态
    // 菜单栏内容
    let [menus, setMenus] = useState([])
    // 添加内容弹框是否可见
    let [contentVisible, setContentVisible] = useState(false)
    // 表单接口
    let [formApi, setFormApi] = useState({
        setValues: (data:any) => {},
        setValue: (field:string,value:any) => {}
    })
    // 添加的内容
    let [addContent, setAddContent] = useState(JSON.stringify(empty))

    const { Section, Input, Select, Switch } = Form;

    // 渲染field字段
    const renderField = (field:string) => {
        return <ArrayField field={field}>
            {({ add, arrayFields, addWithInitValue }) => (
                <React.Fragment>
                    <Button onClick={add} icon={<IconPlusCircle />} theme='light'>新增字段</Button>
                    {
                        arrayFields.map(({ field, key, remove }, i) => (
                            <div key={key} style={{ width: 1000, display: 'flex' }}>
                                <Input field={`${field}[field]`} label={"字段名称"} style={{ width: 150, marginRight: 10 }} />
                                <Select field={`${field}[type]`} label={"字段类型"} style={{ width: 100, marginRight: 10 }}>
                                    <Select.Option value='string'>string</Select.Option>
                                    <Select.Option value='i32'>i32</Select.Option>
                                    <Select.Option value='i64'>i64</Select.Option>
                                    <Select.Option value='object'>object</Select.Option>
                                    <Select.Option value='bool'>bool</Select.Option>
                                    <Select.Option value='double'>double</Select.Option>
                                </Select>
                                <Input field={`${field}[desc]`} label={"描述"} style={{ width: 150, marginRight: 10 }} />
                                <Input field={`${field}[fieldName]`} label={"字段别名"} style={{ width: 150, marginRight: 10 }} />
                                <Switch style={{ marginRight: 10 }} label="必填" field={`${field}[require]`} />
                                <Button type='danger' theme='borderless' icon={<IconMinusCircle />} onClick={remove} style={{ margin: 12 }}></Button>
                            </div>
                        ))
                    }
                </React.Fragment>
            )}
        </ArrayField>
    }

    // 渲染form表单
    const renderForm = () => {
        return  (<Form initValues={empty} getFormApi={(api) => setFormApi(api)} labelPosition={"left"}>
            {({ formState, values, formApi }) => (
                <>
                <Section text={'基本信息'}>
                    <Row gutter={16}>
                        <Col span={3}>
                            <Select field="method" label={"请求方式"} style={{width: 300}}>
                                <Select.Option value="get">get</Select.Option>
                                <Select.Option value="post">post</Select.Option>
                                <Select.Option value="put">put</Select.Option>
                                <Select.Option value="delete">delete</Select.Option>
                            </Select>
                        </Col>
                        <Col span={8}><Input field='url' label='接口地址'/></Col>
                        <Col span={8}><Input field='desc' label='接口描述'/></Col>
                    </Row>
                </Section>
                <Section text={'header信息'}>
                    {renderField('header')}
                </Section>
                <Section text={'body信息'}>
                    {renderField('req')}
                </Section>
                <Section text={'返回信息'}>
                    {renderField('resp')}
                </Section>
                <Section text={'其他配置'}>
                    <Row gutter={16}>
                        <Col span={8}><Input field='other.method' label='方法名'/></Col>
                        <Col span={8}><Input field='other.rpcModule' label='RPC模块名'/></Col>
                    </Row>
                </Section>
                <Section text={'操作'}>
                    <Space>
                        <Button type="primary" onClick={()=>{saveState(formState)}}>保存到数据库</Button>
                        <Button type="secondary" onClick={()=>{exportState(formState)}}>导出结果</Button>
                        <Button type="danger" onClick={()=>{DeleteData(formState.values.id).then(()=>{
                            Toast.success('删除成功')
                            menuInit()
                        })}}>删除数据</Button>
                    </Space>
                </Section>
            </>)}
        </Form>)
    }


    // 渲染菜单
    const renderSelect = (data:ICode[]) => {
        if (data == null) {return}
        let plugins: JSX.Element[] = []
        data.forEach((item:ICode)=>plugins.push(<Select2.Option key={item.id} value={item.id}>{`[${item.method}] ${item.url} (${item.desc})`}</Select2.Option>))
        return plugins
    }
    // 菜单选中事件
    const menuSelect = (id:any) => {
        GetData(id).then((data:any) => {
            formApi.setValues(data)
            // array类型需要单独再设置一遍，否则无法生效
            formApi.setValue('header', data.header)
            formApi.setValue('req', data.req)
            formApi.setValue('resp', data.resp)
            // id也需要单独设置否则保存会没有ID
            formApi.setValue('id', data.id)
            console.log(data)
        })
    }
    // 保存到数据库
    const saveState = (values:any) => {
        let data = values.values
        SaveData(data.id, data).then(() => Toast.success('保存成功！'))
        console.log(data)
    }
    // 导出结果
    const exportState = (values:any) => {
        console.log(JSON.stringify(values.values))
        Toast.success('打开控制台查看！')
    }
    // 菜单初始化
    const menuInit = () => {
        GetAllData().then((data:any)=> setMenus(data))
    }
    // 界面初始化
    const viewInit = useCallback(() => {
        menuInit()
    }, [])
    useEffect(viewInit, [viewInit])

    return (
        <div>
            <Space style={{marginBottom: 20}}>
                <Button theme='solid' type='primary' style={{ marginRight: 8 }} onClick={()=>{setContentVisible(true)}}>新增接口</Button>
                <Select2 filter style={{ width: 300 }} onSelect={menuSelect} placeholder='请选择接口'>
                    {renderSelect(menus)}
                </Select2>
            </Space>
            {renderForm()}
            <Modal
                title="添加内容"
                visible={contentVisible}
                onOk={()=>{
                    AddData(JSON.parse(addContent)).then(() => {
                        Toast.success('添加成功')
                        menuInit()
                        setContentVisible(false)
                    })
                }}
                onCancel={()=>{setContentVisible(false)}}
                centered
                bodyStyle={{overflow: 'auto', height: 240}}>
                <TextArea value={addContent} onChange={(data) => setAddContent(data)} rows={11} />
            </Modal>
        </div>
    );
}