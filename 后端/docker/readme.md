# 资源

- [Docker 官网](https://www.docker.com/)
- [Docker 文档](https://docs.docker.com/)（[中文文档入口](https://docs.docker.com/zh-cn/) 可选）
- [Docker Hub](https://hub.docker.com/)：公共镜像仓库，搜 `nginx`、`mongo`、`redis` 等
- 容器镜像规范：[OCI](https://opencontainers.org/)（Docker 兼容）

# 理论（速览）

- **镜像（Image）**：只读模板，分层存储（Union FS），含应用与运行环境；用 `Dockerfile` 描述如何构建。
- **容器（Container）**：镜像的运行实例，可启停、删建；同一镜像可起多个容器，彼此隔离。
- **与虚拟机差异**：容器共享宿主机内核，更轻、启动更快；隔离粒度小于完整 VM，适合打包依赖与一致环境。
- **Docker 引擎**：守护进程 `dockerd` + 客户端 `docker` CLI；**Docker Desktop** 在 macOS/Windows 上附带引擎、GUI、Kubernetes 可选组件等。
- **注册表（Registry）**：存镜像；默认从 **Docker Hub** 拉取，也可自建 **Harbor** 等。
- **Compose**：用 `compose.yaml`（或 `docker-compose.yml`）定义多容器应用，一条命令起整套依赖（Web + DB + 缓存）。

# 安装

## macOS / Windows（学习、日常开发最常见）

### Windows 用户（先做这一步）

1. 先安装并启用 WSL 2：在 **PowerShell** 或 **CMD** 中执行 `wsl --install`。
2. 如果系统提示重启，重启后再继续。
3. 重新打开终端后，执行 `wsl --status`，确认 WSL 已正常安装并运行。
4. 再安装 **Docker Desktop**：[下载页面](https://www.docker.com/products/docker-desktop/)。
5. 打开 Docker Desktop，按提示完成初始化；菜单栏图标就绪即表示引擎在运行。
6. 终端执行 `docker version`，应能看到 **Client** 与 **Server** 信息（Server 不可用多半是 Desktop 未启动）。

### macOS 用户

1. 安装 **Docker Desktop**：[下载页面](https://www.docker.com/products/docker-desktop/)。
2. 打开 Docker Desktop，按提示完成初始化；菜单栏图标就绪即表示引擎在运行。
3. 终端执行 `docker version`，应能看到 **Client** 与 **Server** 信息（Server 不可用多半是 Desktop 未启动）。

## Linux（服务器）

- 在 Linux 服务器上，通常直接安装 **Docker Engine**，而不是 Docker Desktop。
- 建议按发行版官方文档走官方仓库安装，例如 Ubuntu/Debian、CentOS/RHEL、Fedora 等。
- 常见安装命令示例：

  ```bash
  # Ubuntu / Debian
  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  # CentOS / RHEL / Fedora
  sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  ```

- 安装完成后启动服务并验证：

  ```bash
  sudo systemctl enable --now docker
  sudo docker version
  ```

- 如果需要，可以把当前用户加入 `docker` 组，避免每次都加 `sudo`。

## 安装后自检

- `docker run hello-world`：拉取测试镜像并运行，成功则说明拉取与运行链路正常。

# 常用命令

## 帮助与信息

- `docker help`：子命令帮助
- `docker version`：客户端/服务端版本
- `docker info`：引擎与存储、镜像等概要

## 镜像

- `docker pull 镜像名[:标签]`：拉取（默认 `latest`）
- `docker images` / `docker image ls`：本地镜像列表
- `docker rmi 镜像ID或名:标签`：删除镜像（有容器在用需先处理容器）
- `docker build -t 名:标签 .`：在当前目录按 `Dockerfile` 构建（`.` 为构建上下文）

## 容器生命周期

- `docker run [选项] 镜像 [命令]`：创建并启动容器  
  - 常用：`-d` 后台；`-p 宿主机端口:容器端口` 端口映射；`--name 名字`；`-v 宿主机路径:容器路径` 挂载卷；`--rm` 退出后自动删除
- `docker ps`：运行中的容器；`-a` 含已退出
- `docker start 容器` / `docker stop 容器` / `docker restart 容器`
- `docker logs 容器`：查看日志；`-f` 跟随输出
- `docker exec -it 容器 sh` 或 `bash`：进入运行中容器执行 shell（镜像需带对应 shell）

## 清理

- `docker rm 容器ID或名`：删除已停止的容器
- `docker container prune`：清理已停止容器（注意确认）
- `docker image prune`：清理悬空镜像等（按需）

## Compose（V2 命令为 `docker compose`）

- `docker compose up -d`：按当前目录 `compose.yaml` 后台启动
- `docker compose down`：停止并删除 compose 创建的资源（默认不删命名卷，可加 `-v` 谨慎删卷）
- `docker compose ps` / `logs`：查看服务状态与日志

# 最小示例

```bash
# 交互运行并删除（适合试玩）
docker run --rm -it alpine sh

# 后台跑 nginx，本机 8080 访问
docker run -d -p 8080:80 --name web nginx
```

# 学习顺序建议

1. 装好 **Docker Desktop** 或 **Engine**，`hello-world` 跑通。
2. 掌握 **`docker run` / `ps` / `logs` / `exec` / `stop` / `rm`**，理解端口映射与卷挂载。
3. 学写简单 **Dockerfile**：`FROM`、`WORKDIR`、`COPY`、`RUN`、`CMD`/`ENTRYPOINT`。
4. 需要多服务时用 **Compose**；再按需学网络、卷、多阶段构建、镜像瘦身与安全扫描。
