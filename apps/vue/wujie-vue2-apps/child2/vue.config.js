const { defineConfig } = require('@vue/cli-service')
const { ModuleFederationPlugin } = require('webpack').container

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: 'auto',
  configureWebpack: {
    target: ["web", "es5"],
    output: {
      environment: {
        asyncFunction: false
      }
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "child2",
        filename: "remoteEntry.js"
      })
    ],
  },
  devServer: {
    port: 8082,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    },
    allowedHosts: 'all',
  }
})
