// examples vite 用
// const config = require('./.eslintrc.js')
const js = require('@eslint/js')
const globals = require('globals')
const vue = require('eslint-plugin-vue')

module.exports = [
  js.configs.recommended, // 应用 ESLint 推荐规则
  // 全局用
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {

    }
  },
  // vue 用
  {
    files: [
      '**/*.vue',
    ],
    languageOptions: {
      parser: require('vue-eslint-parser'),
      parserOptions: {
        // parser: require('eslint-parser'), // 解析 `<script>` 部分
        sourceType: 'module',
      },
    },
    plugins: {
      vue: vue
    },
    // rules: config.rules,
    rules: {
      ...vue.configs.recommended.rules,
      'vue/attributes-order': 'off',
      'vue/order-in-components': 'off',
      // 'no-unused-vars': 'error',
      // 'vue/no-unused-vars': 'error',
    },
  },
]