# Wujie Vue3 Micro Frontend Demo

这是一个基于 Vue 3、Vite 和 wujie-vue3 的微前端演示项目。

## 项目结构

```text
wujie-vue3-apps/
├── main/      # 主应用
├── app1/      # 子应用 App1
├── app2/      # 子应用 App2
├── start-all.bat
└── start-all.sh
```

## 页面结构

主应用 `main` 使用左右结构：

- 首页：主应用自己的页面。
- App1：通过无界加载 `http://localhost:8081/`。
- App2：通过无界加载 `http://localhost:8082/`。

## 启动

安装依赖：

```bash
npm run install:all
```

同时启动三个项目：

```bash
npm run start:all
```

也可以分别启动：

```bash
cd main
npm run dev

cd app1
npm run dev

cd app2
npm run dev
```

## 访问地址

- 主应用：http://localhost:8080
- App1：http://localhost:8081
- App2：http://localhost:8082

## 构建

```bash
npm run build:all
```
