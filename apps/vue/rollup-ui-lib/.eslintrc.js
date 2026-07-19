// rollup 用
module.exports = {
  parser: 'vue-eslint-parser', // 或 'babel-eslint'（需安装）
  parserOptions: {
    ecmaVersion: 2020, // 支持 ES6+
    sourceType: 'module' // 启用模块语法
  },
  env: {
    browser: true, // 启用浏览器全局变量（如 console、window）
    // node: true    // 如果需要 Node.js 全局变量（如 process）
  },
  extends: [
    'eslint:recommended', // 确保基础规则生效
    'plugin:vue/essential'
  ],
  rules: {
    // on: 如果写了 console 就报错
    'no-console': 'off'
  }
}