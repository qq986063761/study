const path = require('path')
const { defineConfig } = require('@vue/cli-service')
const { ModuleFederationPlugin } = require('webpack').container

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  devServer: {
    port: process.env.VUE_APP_PORT
  },
  configureWebpack: {
    output: {
      // 开发模式也加入内容哈希，避免 shared provider 生成同名异步 chunk。
      chunkFilename: 'js/[name].[contenthash:8].js'
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'main',
        remotes: {},
        shared: {
          '@main/runtime': {
            import: path.resolve(__dirname, './src/runtime/index.ts'),
            shareKey: '@main/runtime',
            singleton: true,
            requiredVersion: false,
            version: '1.0.0'
          },
          vue: { singleton: true, requiredVersion: '^2.6.14' },
          'vue-router': { singleton: true, requiredVersion: '^3.5.1' },
          vuex: { singleton: true, requiredVersion: '^3.6.2' },
          'element-ui': { singleton: true, requiredVersion: '^2.15.14' }
        }
      })
    ]
  }
})
