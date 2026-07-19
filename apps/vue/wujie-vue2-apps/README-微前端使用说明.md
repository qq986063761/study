# 微前端应用使用说明

## 项目结构
```
wujie-vue2-single-apps/
├── main/           # 主应用（基座应用）
├── child1/         # 子应用1
├── child2/         # 子应用2
└── start-all.bat   # 一键启动脚本
```

## 功能说明

### 主应用 (main)
- 左侧菜单导航
- 右侧内容区域
- 集成无界微前端框架
- 支持路由切换

### 菜单结构
- **首页**: 主应用自己的内容（使用 `<router-view/>`）
- **Child1**: 加载子应用1的完整应用
- **Child2**: 加载子应用2的完整应用

## 启动方式

### 方式一：一键启动（推荐）
双击运行 `start-all.bat` 文件，会自动启动所有应用。

### 方式二：手动启动
1. 启动主应用：
   ```bash
   cd main
   npm run serve
   ```

2. 启动子应用1：
   ```bash
   cd child1
   npm run serve
   ```

3. 启动子应用2：
   ```bash
   cd child2
   npm run serve
   ```

## 访问地址
- 主应用: http://localhost:8080
- 子应用1: http://localhost:8081
- 子应用2: http://localhost:8082

## 技术栈
- **主应用**: Vue 2 + Vue Router + Vuex + 无界微前端
- **子应用**: Vue 2 + Vue Router + Vuex
- **微前端框架**: wujie-vue2

## 注意事项
1. 确保所有应用都正常启动后再访问主应用
2. 子应用的端口号需要与配置中的一致
3. 如果修改了子应用端口，需要同步更新主应用中的URL配置
