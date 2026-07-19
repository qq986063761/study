const { defineConfig } = require('@vue/cli-service')
const { ModuleFederationPlugin } = require('webpack').container

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: 'auto',
  configureWebpack: {
    target: ["web", "es5"],
    output: {
       // 禁止新语法，支持老浏览器
      environment: {
        asyncFunction: false
      }
    },
    optimization: {
      splitChunks: false // 必须，不然 main 引入报错
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "child1",
        filename: "remoteEntry.js",
        exposes: {
          "./export": "./src/plugins/export.js"
        }
      }),
    ],
  },
  devServer: {
    port: 8081,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    },
    allowedHosts: 'all',
  }
})
