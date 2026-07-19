# wape-ui
- 用于学习 UI 库开发流程的项目

# webpack
- npm i -D webpack webpack-cli webpack-dev-server

# es6 转 es5
- npm i -D babel-core@6.26.3 babel-loader@7.1.5 babel-preset-env@1.7.0 

# vue
- npm i -D vue vue-template-compiler vue-loader

# css、scss
- npm i -D style-loader css-loader node-sass sass-loader autoprefixer postcss-loader postcss-import

# 单元测试 jest
- npm i -D jest @vue/test-utils vue-jest babel-jest

# 进度显示、删除文件
- npm i -D progress-bar-webpack-plugin rimraf

# demo需要的包
- npm i -D html-webpack-plugin url-loader vue-router

# 发布
- 配置好 package.json 中的 name、version、main（用户 import 时的文件）
- 执行 npm publish 将当前项目版本发布到 npm（需要登录 npm 账号）

# 全部引入
- import Wape from 'wape-ui/src/index.js'
- Vue.use(Wape)

# 按需引入
- import {TextEllipsis} from 'wape-ui/src/index.js'
- Vue.use(TextEllipsis)