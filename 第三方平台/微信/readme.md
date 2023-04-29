# 资源
- [微信app解决](http://www.wxapp-union.com/special/solution.html#part1)
- [订阅号 api 文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1445241432)
- [小程序 api 文档](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/structure.html)；
- [小程序图片裁剪库](https://github.com/we-plugin/we-cropper)；
- [小程序 html 解析插件](https://github.com/icindy/wxParse)；

# 账号
- AppID：wx256f3e3a18ffe181；
- AppSecret：0d0a325ee18ed26f683c0968d89cad62；
- AppID(小程序ID) wxfc47aee2c2e8326a
- AppSecret(小程序密钥) c1fb235d24e460cb7e8785e96126bfcf

# 小程序双线程设计好处
- 渲染层 + 逻辑层 -》Native -》第三方服务（http、websocket）
- 好处：
  - 防止恶意 XSS 攻击
  - 防止开发者恶意盗取用户信息
  - 提升页面性能

# 移动端设备分辨率
- 在移动端，1px的逻辑像素点可以包含多个1px的物理像素点，所以某些时候移动端看到的1px不是真1px（1px的物理像素点也就是通常web开发中的px）；
- 不同移动设备上1px逻辑像素对应的物理像素点的个数不同（毕竟我们不能规定多少像素就是一个点，而是由厂商规定）；
- 以下是iphone小程序像素单位换算，常见规范的移动端图标规格（@1x、@2x、@3x）也是按类似iphone这种规格来定的：
  - iPhone5：1px（逻辑像素）= 2.34rpx（也是2.34px的物理像素）；
  - iPhone6：1px（逻辑像素） = 2rpx（也是2px的物理像素，所以iphone6做标准换算起来最方便）；
  - iPhone6 Plus：1px（逻辑像素） = 1.81rpx（也是1.81px的物理像素）；

# IDE 快捷方式：
- app.json 中追加一个 pages 链接会自动生成对应的4个同名页面文件；

# 小程序开发流程注意事项：
- 账号：
  - 必须用企业号注册小程序账号才能配置请求域名；
- 前端：
  - 小程序项目目录深度不能超过5层；
  - 小程序项目大小不能超过2M；
  - 像素单位按情况采用rpx用于适应多种机型；
  - flex布局在移动端有优势；
  - app.json的toolbar图片路径禁止绝对路径，避免真机BUG；
  - 小程序中没有dom操作，任何dom操作相关插件都不能使用；
- 服务端：
  - 小程序只支持https域名请求；
- 设计：
  - 建议按 iphone6（375px = 750rpx宽） 尺寸设计（方便开发做适配：iPhone5：1px = 2.34rpx、iPhone6：1px = 2rpx、iPhone6 Plus：1px = 1.81rpx）；
  - 可浏览下小程序设计规范（https://mp.weixin.qq.com/debug/wxadoc/design/index.html?t=20171227）；

# 企业微信
- [第三方服务官网](https://open.work.weixin.qq.com/)
- [企业微信应用接入指引](https://open.work.weixin.qq.com/wwopen/common/readDocument/13245#1.%20%E6%B5%81%E7%A8%8B%E5%9B%BE)
- 开发流程简介：
  - 先在服务商管理后台创建应用，并配置好指令回调、数据回调URL、可信域名等（后台配置，并能正常接收微信发起的请求获取信息表示通过，记得后台要返回success）
  - 然后配置网页应用url（如：https://open.weixin.qq.com/connect/oauth2/authorize?appid=应用的SuiteID&redirect_uri=https%3A%2F%2Fdemo1.topscrm.cn%2Fh5%2Findex.html&response_type=code&scope=snsapi_privateinfo&state=1#wechat_redirect），重定向后微信会把code和state回传给前端用于从后台获取用户信息等数据
  - 报错：无效的 agentid，可能是可信域名未通过

# 企业微信H5微应用登录流程
```js
// 环境判断
var userAgent = navigator.userAgent.toLowerCase()
var isWxWork = /micromessenger/i.test(userAgent) // 企业微信 app 内的 web 应用

// url 上直接能通过 query 获取到 code 后向后端请求用户信息
```

# 企业微信H5微应用授权
```js
// 微信内置浏览器必须调用 wx.config，非微信浏览器只需要 wx.agentConfig
if (/MicroMessenger/i.test(navigator.userAgent)) {
  wx.config({
    beta: true, // 必须这么写，否则 wx.invoke 调用形式的 jsapi 会有问题
    debug: false,
    appId: rs.data.appid, // 企业 id，如果为了安全就后台返回
    timestamp: rs.data.timestamp, // 后台给的时间戳
    nonceStr: rs.data.noncestr, // 后台给的随机码
    signature: rs.data.signature, // 后台给的签名
    jsApiList: ['agentConfig']
  })
  wx.ready(() => {
    // 授权成功后，再调用 wx.agentConfig 继续授权
  })
  wx.error(err => {
    console.log('wx.error', err)
  })
}

wx.agentConfig({
  corpid: rs.data.appid, // 必填，企业微信的corpid，必须与当前登录的企业一致
  agentid: rs.data.agentId, // 必填，企业微信的应用id （e.g. 1000247）
  timestamp: rs.data.timestamp, // 后台给的时间戳
  nonceStr: rs.data.noncestr, // 后台给的随机码
  signature: rs.data.agentSignature, // 需注意agentConfig的签名与config的签名不一致
  jsApiList: ['openDefaultBrowser', 'selectExternalContact', 'selectPrivilegedContact'], //必填
  success: () => {
    // 通讯录组件初始化
    if (WWOpenData) {
      // canvas
      if (WWOpenData.initCanvas) WWOpenData.initCanvas()
      // 检查通讯录组件是否可用
      if (WWOpenData.checkSession) {
        WWOpenData.checkSession({
          success() {},
          fail: err => {
            console.log('WWOpenData.checkSession fail', err)
          }
        })
      }
      if (WWOpenData.on) {
        WWOpenData.on('error', err => {
          console.log('WWOpenData.on error', err)
        })
      }
      // 初始化后首次绑定通讯录组件
      setTimeout(() => {
        WWOpenData.bindAll(document.querySelectorAll('ww-open-data'))
      }, 300)
    }
  }, 
  fail: err => {
    console.log('wx.agentConfig fail', err)
  }
})
```

# 企业微信H5微应用通讯录组件
- [文档](https://developer.work.weixin.qq.com/document/path/91958)