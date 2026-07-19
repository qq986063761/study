#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始启动所有微前端应用...${NC}"

# 检查是否已安装依赖
if [ ! -d "main/node_modules" ]; then
    echo -e "${YELLOW}检测到未安装依赖，开始安装...${NC}"
    npm run install:all
fi

# 启动所有应用
echo -e "${GREEN}启动主应用和子应用...${NC}"
npm run start:all
