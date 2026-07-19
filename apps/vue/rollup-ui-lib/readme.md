# 包版本
- node 版本 v20.16.0

# 脚本
"dev:examples": "vite examples", 开发demo
"watch": "rollup -c -w", 实时监听并 build
"build": "NODE_ENV=production rollup -c", 打包库
"analyze": "NODE_ENV=production rollup -c --analyze", 分析包
"build:examples": "vite build examples" 打包demo




[打包 rollup.js](https://cn.rollupjs.org/)
[打包 Rslib](https://lib.rsbuild.dev/zh/)
[分析工具 rollup-plugin-visualizer]()
[按需插件 babel-plugin-component]()
[格式检查 eslint-plugin-vue]()
[代码风格格式化 eslint-config-prettier eslint-plugin-prettier]()
[单元测试 Vitest]()

构建工具选型（打包、代码压缩、图片、demo演示）
开发规范
单元测试
私有化npm
按需引入 js css