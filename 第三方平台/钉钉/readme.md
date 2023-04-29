# 钉钉体验顶部插件文档
申请前注意事项，
一、个人试用链路图：
https://gw.alicdn.com/tfs/TB1N32Ezrr1gK0jSZR0XXbP8XXa-9043-4847.jpg
二、demo直接体验链接：有成财务：https://cwapp.superboss.cc/mobileexample/index.html
三、接入要求：
1、接入顶部插件，插件信息：
https://www.npmjs.com/package/ding-open-org-trial-entry
2、个人版里接入服务群：接入文档
https://ding-doc.dingtalk.com/doc#/serverapi3/gydt1f

# H5微应用登录流程
```js
// 环境判断
var userAgent = navigator.userAgent.toLowerCase()
var isDingDing = userAgent.includes('dingtalk') // 钉钉 app 内的 web 应用

// 从 url 上获取 corpId
const query = {}

// dd sdk 加载完毕后
dd.ready(() => {
  // 获取授权 code
  dd.runtime.permission.requestAuthCode({
    corpId: query.corpId, // 企业id
    onSuccess: async info => {
      // 获取到 code 向后端获取用户信息登录
      query.code = info.code
    },
    onFail: err => {
      console.log(`requestAuthCode onFail`, error)
    }
  })
})

// 监听错误
dd.error(error => {
  console.log(`dd.error `, error)
})
```

# H5微应用授权 api 调用
```js
// 从后端获取到签名信息后，然后调用 api 授权
dd.config({
  agentId: rs.data.agentId, // 必填，微应用ID
  corpId: rs.data.corpId,//必填，企业ID
  timeStamp: rs.data.timeStamp, // 必填，生成签名的时间戳
  nonceStr: rs.data.nonceStr, // 必填，生成签名的随机串
  signature: rs.data.signature, // 必填，签名
  type: 0, // 选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
  jsApiList : [
    'biz.util.openLink',
    'biz.ding.create',
    'biz.contact.complexPicker',
    'biz.contact.departmentsPicker',
    'biz.util.uploadAttachment',
    'biz.cspace.chooseSpaceDir',
    'biz.cspace.saveFile',
    'biz.cspace.preview'
  ] // 必填，需要使用的jsapi列表，注意：不要带dd。
})
```