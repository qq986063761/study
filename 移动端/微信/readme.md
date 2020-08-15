# 推荐
- [微信app解决](http://www.wxapp-union.com/special/solution.html#part1)

# 订阅号
- [订阅号 api 文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1445241432)

## 账号
- AppID：wx256f3e3a18ffe181；
- AppSecret：0d0a325ee18ed26f683c0968d89cad62；

# 小程序
- [小程序 api 文档](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/structure.html)；
- [图片裁剪库](https://github.com/we-plugin/we-cropper)；
- [html解析插件](https://github.com/icindy/wxParse)；
- AppID(小程序ID) wxfc47aee2c2e8326a
- AppSecret(小程序密钥) c1fb235d24e460cb7e8785e96126bfcf

## 移动端设备分辨率
- 在移动端，1px的逻辑像素点可以包含多个1px的物理像素点，所以某些时候移动端看到的1px不是真1px（1px的物理像素点也就是通常web开发中的px）；
- 不同移动设备上1px逻辑像素对应的物理像素点的个数不同（毕竟我们不能规定多少像素就是一个点，而是由厂商规定）；
- 以下是iphone小程序像素单位换算，常见规范的移动端图标规格（@1x、@2x、@3x）也是按类似iphone这种规格来定的：
  - iPhone5：1px（逻辑像素）= 2.34rpx（也是2.34px的物理像素）；
  - iPhone6：1px（逻辑像素） = 2rpx（也是2px的物理像素，所以iphone6做标准换算起来最方便）；
  - iPhone6 Plus：1px（逻辑像素） = 1.81rpx（也是1.81px的物理像素）；

## 快捷方式：
- app.json 中追加一个 pages 链接会自动生成对应的4个同名页面文件；

## 小程序开发流程注意事项：
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
  - 报错：无效的agentid，可能是可信域名未通过