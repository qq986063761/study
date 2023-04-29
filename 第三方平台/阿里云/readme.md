
# 阿里云 web 端 js 上传文件流程
```js
  // 自己准备接收对象
  let param = {
    key: "",
    policy: "",
    OSSAccessKeyId: "",
    success_action_status: "200",
    signature: ""
  }

  // 准备一个随机码生成函数，为了保证唯一文件名
  function randomString(len) {
    len = len || 32;
    var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    var maxPos = chars.length;
    var pwd = "";
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  // 通过后端封装的获取 oss 代理数据接口，获取数据，返回数据格式如下格式
  // rs.data = {
  //   dir: 'asf',
  //   policy: 'asfsafasfasfa',
  //   accessid: 'asfasfasasfasfasf',
  //   signature: 'fasfasfasfasfasf',
  //   host: 'qwrwqrqwr'
  // }
  let rs = await ajax.getOssProxy();

  // 将返回数据，赋值到自己准备的参数中 extName 是文件的扩展名
  param.key = rs.data.dir + '/' + randomString(10) + '.' + extName;
  param.policy = rs.data.policy;
  param.OSSAccessKeyId = rs.data.accessid;
  param.signature = rs.data.signature;

  // 将自己准备的参数，封装成 formdata 数据
  const formdata = new FormData();
  formdata.append("name", file.name);

  for (const key in param) {
    if (param.hasOwnProperty(key)) {
      const value = param[key];
      formdata.append(key, value);
    }
  }

  // 附件必须追加到最后，否则上传会失败
  formdata.append("file", file);

  // 发起真正的附件上传 post 请求
  let endRs = await ajax.post(rs.data.host, formdata);

  // 如果上面最后这个接口请求成功，那么阿里云上的文件地址，将可以通过下面的地址访问
  let filurl = rs.data.host + '/' + param.key;
```

# js 上传
- [文档](https://help.aliyun.com/document_detail/52204.html#h2-u4E0Au4F20u63A7u52366)

# 视频播放
- [文档](https://help.aliyun.com/document_detail/125570.html?spm=a2c4g.11186623.6.1082.2e845be0TCR8PP);