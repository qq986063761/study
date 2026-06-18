# 资源
- [nginx 官网](https://nginx.org/en/download.html)
- [慕课网 https 本地证书生成命令（GitHub）](https://gist.github.com/Jokcy/5e73fd6b2a9b21c142ba2b1995150808)
- 本地证书生成命令：
  ```bash
  openssl req -x509 -newkey rsa:2048 -nodes -sha256 -keyout localhost-privkey.pem -out localhost-cert.pem
  ```

# 简介

nginx 是一个高性能、轻量级的 Web 服务器，同时也常用作反向代理、负载均衡器和 HTTP 缓存。

nginx 主要特点：
- 事件驱动、异步架构，适合高并发场景。
- 低内存占用、低 CPU 消耗。
- 反向代理、负载均衡、缓存、SSL/TLS、HTTP/2 支持。
- 可以作为静态资源服务器、API 网关、微服务入口。

# nginx 作用

- Web 服务器
- 反向代理服务器
- 负载均衡
- HTTP 缓存
- SSL/TLS 终端
- 静态文件服务

# 原理

nginx 采用 Master/Worker 进程模型：
- Master 进程负责读取配置、管理 Worker 进程、重载配置和信号处理。
- Worker 进程负责实际处理网络连接和请求。

核心机制：
- 事件驱动模型（epoll/kqueue/select）
- 非阻塞 I/O
- 通过模块化设计实现功能扩展

# 配置示例

以下是一个常见的 `http` 配置示例，包含缓存、gzip、HTTP->HTTPS 重定向、HTTPS、跨域和反向代理：

```nginx
http {
    # 配置缓存区域
    proxy_cache_path cache levels=1:2 keys_zone=my_cache:10m;

    # gzip 压缩
    gzip on;
    gzip_types text/plain application/x-javascript application/javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;

    # 默认 HTTP 服务，重定向到 HTTPS
    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name localhost;
        return 302 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name localhost;
        http2_push_preload on;

        # 添加响应头
        add_header Access-Control-Allow-Origin *;

        # HTTPS 证书
        ssl_certificate_key ./localhost-privkey.pem;
        ssl_certificate ./localhost-cert.pem;

        location / {
            # 跨域预检请求处理
            if ($request_method = 'OPTIONS') {
                add_header Access-Control-Allow-Origin *;
                add_header Access-Control-Allow-Methods "GET,POST,PUT,DELETE,OPTIONS";
                add_header Access-Control-Allow-Headers "Authorization,Content-Type";
                return 204;
            }

            proxy_cache my_cache;
            proxy_pass http://127.0.0.1:8888;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

# 安装指南

## macOS 安装

### 1. Homebrew 安装

```bash
brew install nginx
```

安装完成后，默认配置文件位置：
- `/usr/local/etc/nginx/nginx.conf`（Intel Mac）
- `/opt/homebrew/etc/nginx/nginx.conf`（Apple Silicon）

默认网站根目录：
- `/usr/local/var/www` 或 `/opt/homebrew/share/nginx/html`

启动、停止、重启：

```bash
brew services start nginx
brew services stop nginx
brew services restart nginx
```

### 2. 官方源码编译（可选）

```bash
curl -O https://nginx.org/download/nginx-1.25.0.tar.gz
tar zxvf nginx-1.25.0.tar.gz
cd nginx-1.25.0
./configure --prefix=/usr/local/nginx
make
sudo make install
```

启动命令：

```bash
sudo /usr/local/nginx/sbin/nginx
sudo /usr/local/nginx/sbin/nginx -s reload
sudo /usr/local/nginx/sbin/nginx -s stop
```

## Windows 安装

### 1. 官方预编译包

1. 访问 [nginx 下载页面](https://nginx.org/en/download.html)。
2. 下载 `nginx/Windows` 下的稳定版压缩包。
3. 解压到一个目录，例如 `C:\nginx`。
4. 进入 `C:\nginx`，运行 `nginx.exe` 启动服务。

默认配置文件：
- `C:\nginx\conf\nginx.conf`

停止 nginx：

```powershell
nginx -s stop
```

重新加载配置：

```powershell
nginx -s reload
```

### 2. WSL 安装（可选）

如果你使用 Windows 子系统 Linux（WSL），可以在 WSL 内安装 nginx：

```bash
sudo apt update
sudo apt install nginx
sudo service nginx start
```

## 常见检查命令

```bash
nginx -v
nginx -V
nginx -t
```

- `nginx -v`：显示版本号。
- `nginx -V`：显示编译参数。
- `nginx -t`：测试配置语法。

# 参考

- [nginx 官方文档](https://nginx.org/en/docs/)
- [nginx 下载页面](https://nginx.org/en/download.html)
