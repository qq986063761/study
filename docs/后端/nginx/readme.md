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

### 2. WSL 安装（可选）

如果你使用 Windows 子系统 Linux（WSL），可以在 WSL 内安装 nginx：

```bash
sudo apt update
sudo apt install nginx
sudo service nginx start
```

## 常见命令

### 1. 查看版本和帮助

```bash
nginx -v      # 仅显示版本号
nginx -V      # 显示版本号 + 编译参数
nginx -h      # 显示帮助信息
```

### 2. 测试配置和打印配置

```bash
nginx -t                  # 测试配置文件是否正确
nginx -T                  # 测试配置并输出完整配置内容
nginx -t -c /path/to/nginx.conf
```

### 3. 启动和停止

```bash
nginx                     # 使用默认配置启动
nginx -c /path/to/nginx.conf   # 指定配置文件启动
nginx -p /path/to/nginx-root   # 指定工作目录（prefix）
nginx -s stop             # 快速停止
nginx -s quit             # 优雅退出
nginx -s reload           # 重新加载配置
nginx -s reopen           # 重新打开日志文件
```

示例（Windows）：

```powershell
cd D:\Program Files\nginx-1.30.3
nginx.exe -c conf\nginx.conf
nginx.exe -s reload
```

### 4. 运行时参数

```bash
nginx -g "daemon off;"    # 前台运行（适合容器或调试）
nginx -g "error_log /tmp/error.log;"
```

### 6. 命令说明

- `-c`：指定配置文件路径。
- `-p`：指定 nginx 的前缀目录（工作目录）。
- `-g`：设置全局指令。
- `-s`：向主进程发送信号，如 `stop`、`quit`、`reload`、`reopen`。
- `-t`：只验证配置，不启动服务。
- `-T`：验证配置并打印最终配置内容。
- `-V`：查看编译配置，便于定位模块支持情况。

# 参考

- [nginx 官方文档](https://nginx.org/en/docs/)
- [nginx 下载页面](https://nginx.org/en/download.html)
