# 代码生成器
## 项目背景
作为一个CRUD工程师，每天的工作就是写接口和CRUD，其中不乏有大量非常重复的代码，天天写这些重复的代码实在太无趣了。
所以我干脆自己写了一个代码生成器，可以根据事先定义好的接口快速生成函数名称、结构体、注释等重复代码。

通过代码生成器可以让我们从这些无聊且没成长的东西中解放出来，让我们时间花在更有意义的事情上来。
目前只实现了非常简单的生成功能，后续会根据平时工作的需求来实现一些更复杂的功能

## 项目运行
```shell
# 安装依赖
npm install
# 运行
npm dev
# 打包
npm build
```

## 示例配置
> 查询人员信息
```json
{"id":"683b64b8-897c-4af6-b62f-50ce1f61635d","header":[{"field":"x-token","type":"string","require":true,"desc":"token信息"}],"req":[{"field":"name","type":"string","require":true,"desc":"姓名","string":false}],"resp":[{"field":"name","type":"string","require":true,"desc":"姓名"},{"field":"age","type":"i32","desc":"年龄","require":true}],"method":"get","url":"/api/v0/people","desc":"查询人员信息","other":{"method":"GetPeople","rpcModule":"people","tag":"people"}}
```
> 添加人员信息
```json
{"id":"9e905b5d-c568-4ca9-8297-c8e30415101a","header":[{"field":"x-token","type":"string","require":true,"desc":"token信息"}],"req":[{"field":"name","type":"string","require":true,"desc":"姓名"},{"field":"age","type":"i32","require":false,"desc":"年龄"},{"field":"info","type":"object","require":true,"desc":"信息","fieldName":"Info"},{"field":"info.addr_info","type":"string","require":true,"desc":"地址"},{"field":"info.nickname","type":"string","require":true,"desc":"昵称"}],"resp":[{"field":"status","type":"string","require":true,"desc":"返回结果"}],"method":"post","url":"/api/v0/people","desc":"添加人员信息","other":{"method":"AddPeople","rpcModule":"people","tag":"people"}}
```

## 截图展示


