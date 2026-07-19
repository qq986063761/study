# 拉取环境
我 dockerfile 配置了 node:18，要先 docker pull node:18

# 当前项目构建镜像
docker build -t web-demo .

# 运行 docker 容器环境
docker run -p 3000:3000 web-demo