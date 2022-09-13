import React, {useCallback, useEffect, useState} from 'react';
import {Form, Col, Row, ArrayField, Button, Select as Select2, Space, Toast, Modal, TextArea} from '@douyinfe/semi-ui';
import { IconPlusCircle, IconMinusCircle } from '@douyinfe/semi-icons';
import {AddData, DeleteData, GetAllData, GetData, SaveData, storeNameDatabase} from "../core/tools/db";
import {exportJson} from "../core/tools/util";


export default function Database() {
    // 默认空状态
    let empty: IDatabase = {fields: [], table: "", desc: "", id: ""}
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
    // 批量导入弹框
    let [batchImportVisible, setBatchImportVisible] = useState(false)
    // 批量导入内容
    let [batchImportContent, setBatchImportContent] = useState('')
    const { Section, Input, Select, Switch } = Form;

    // 渲染field字段
    const renderField = (field:string) => {
        return <ArrayField field={field}>
            {({ add, arrayFields, addWithInitValue }) => (
                <React.Fragment>
                    <Button onClick={add} icon={<IconPlusCircle />} theme='light'>新增字段</Button>
                    {
                        arrayFields.map(({ field, key, remove }, i) => (
                            <div key={key} style={{ width: 1200, display: 'flex' }}>
                                <Input field={`${field}[name]`} label={"字段名称"} style={{ width: 150, marginRight: 10 }} />
                                <Select field={`${field}[type]`} label={"字段类型"} style={{ width: 100, marginRight: 10 }}>
                                    <Select.Option value='tinyint'>tinyint</Select.Option>
                                    <Select.Option value='int'>int</Select.Option>
                                    <Select.Option value='i64'>i64</Select.Option>
                                    <Select.Option value='bigint'>bigint</Select.Option>
                                    <Select.Option value='float'>float</Select.Option>
                                    <Select.Option value='double'>double</Select.Option>
                                    <Select.Option value='datetime'>datetime</Select.Option>
                                    <Select.Option value='varchar(255)'>varchar(255)</Select.Option>
                                    <Select.Option value='text'>text</Select.Option>
                                    <Select.Option value='json'>json</Select.Option>
                                </Select>
                                <Input field={`${field}[desc]`} label={"描述"} style={{ width: 150, marginRight: 10 }} />
                                <Switch style={{ marginRight: 10 }} label="不为空" field={`${field}[notNull]`} />
                                <Switch style={{ marginRight: 10 }} label="主键" field={`${field}[primary]`} />
                                <Switch style={{ marginRight: 10 }} label="索引" field={`${field}[index]`} />
                                <Switch style={{ marginRight: 10 }} label="自增" field={`${field}[autoIncrease]`} />
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
                            <Col span={8}><Input field='table' label='数据库表名'/></Col>
                            <Col span={8}><Input field='desc' label='描述'/></Col>
                        </Row>
                    </Section>
                    <Section text={'表结构'}>
                        {renderField('fields')}
                    </Section>
                    <Section text={'操作'}>
                        <Space>
                            <Button type="primary" onClick={()=>{saveState(formState)}}>保存到数据库</Button>
                            <Button type="secondary" onClick={()=>{exportState(formState)}}>导出结果</Button>
                            <Button type="danger" onClick={()=>{DeleteData(formState.values.id).then(()=>{
                                Toast.success('删除成功')
                                menuInit()
                            })}}>删除接口</Button>
                        </Space>
                    </Section>
                </>)}
        </Form>)
    }


    // 渲染菜单
    const renderSelect = (data:IDatabase[]) => {
        if (data == null) {return}
        let plugins: JSX.Element[] = []
        data.forEach((item:IDatabase)=>plugins.push(<Select2.Option key={item.id} value={item.id}>{item.table}</Select2.Option>))
        return plugins
    }
    // 菜单选中事件
    const menuSelect = (id:any) => {
        GetData(id, storeNameDatabase).then((data:any) => {
            formApi.setValues(data)
            // id需要单独设置否则保存会没有ID
            formApi.setValue('id', data.id)
            formApi.setValue('fields', data.fields)
            console.log(data)
        })
    }
    // 保存到数据库
    const saveState = (values:any) => {
        let data = values.values
        SaveData(data.id, data, storeNameDatabase).then(() => Toast.success('保存成功！'))
        console.log(data)
    }
    // 导出结果
    const exportState = (values:any) => {
        exportJson(values.values, "api")
    }
    // 菜单初始化
    const menuInit = () => {
        GetAllData(storeNameDatabase).then((data:any)=> setMenus(data))
    }
    // 界面初始化
    const viewInit = useCallback(() => {
        menuInit()
    }, [])
    useEffect(viewInit, [viewInit])
    // 批量导出
    const batchExport = () => GetAllData(storeNameDatabase).then((data:any)=> exportJson(data, "all"))

    return (
        <div>
            <Space style={{marginBottom: 20}}>
                <Button theme='solid' type='primary' style={{ marginRight: 8 }} onClick={()=>{setContentVisible(true)}}>新增表</Button>
                <Select2 filter style={{ width: 300 }} onSelect={menuSelect} placeholder='请选择表'>
                    {renderSelect(menus)}
                </Select2>
                <Button theme='solid' type='secondary' style={{ marginRight: 8 }} onClick={batchExport}>批量导出</Button>
                <Button theme='solid' type='tertiary' style={{ marginRight: 8 }} onClick={()=>{setBatchImportVisible(true)}}>批量导入</Button>
            </Space>
            {renderForm()}
            <Modal
                title="添加内容"
                visible={contentVisible}
                onOk={()=>{
                    AddData(JSON.parse(addContent), storeNameDatabase).then(() => {
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
            <Modal
                title="批量导入内容"
                visible={batchImportVisible}
                onOk={()=>{
                    let content = JSON.parse(batchImportContent)
                    content.forEach((data:any) => {
                        AddData(data, storeNameDatabase).then()
                    })
                    Toast.success('添加成功')
                    menuInit()
                    setBatchImportVisible(false)
                }}
                onCancel={()=>{setBatchImportVisible(false)}}
                centered
                bodyStyle={{overflow: 'auto', height: 240}}>
                <TextArea value={batchImportContent} onChange={(data) => setBatchImportContent(data)} rows={11} />
            </Modal>
        </div>
    );
}