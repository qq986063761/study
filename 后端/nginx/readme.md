# 资源
- [官网](https://nginx.org/en/download.html)
- [最全中文配置](https://mp.weixin.qq.com/s/wazMIWkrBLeAUSM9ZYaYBg)
- [慕课网https本地证书生成命令github](https://gist.github.com/Jokcy/5e73fd6b2a9b21c142ba2b1995150808)；
- 本地证书生成：openssl req -x509 -newkey rsa:2048 -nodes -sha256 -keyout localhost-privkey.pem -out localhost-cert.pem；


# 简介

# nginx
- 轻量级web服务器、反向代理服务器、电子邮件（imap、pop3）代理服务器；


# 原理

# 配置
```js
  http {
    # 配置缓存
    proxy_cache_path cache levels=1:2 keys_zone=my_cache:10m;

    # gzip压缩
    gzip  on;
    gzip_types text/plain application/x-javascript application/javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;

    # 默认服务，重定向https服务
    server {
      listen       80 default_server;
      listen       [::]:80 default_server;
      server_name localhost;
      return 302 https://$server_name$request_uri;
    }

    server {
      # 监听端口，默认上线端口80，默认https端口443，http2必须基于https
      listen       443 http2;
      server_name  localhost; # 浏览器访问域名;
      http2_push_preload on; # 开启http2的服务端push和preload功能

      # 添加响应头
      add_header Access-Control-Allow-Origin *;

      # https配置
      ssl on; # 打开ssl
      ssl_certificate_key ./localhost-privkey.pem; # 配置ssl key
      ssl_certificate ./localhost-cert.pem; # 配置秘药证书

      # 代理
      location / {
        # 解除跨域检测
        if ($request_method = 'OPTIONS') { 
            add_header Access-Control-Allow-Origin *; 
            add_header Access-Control-Allow-Methods GET,POST,PUT,DELETE,OPTIONS;
            return 204;
        }
        # 配置缓存
        proxy_cache my_cache;
        # 转发到代理ip地址
        proxy_pass http://127.0.0.1:8888;
        # 代理请求头 host 变为 $host 变量
        proxy_set_header Host $host;
      }
    }
  }
```