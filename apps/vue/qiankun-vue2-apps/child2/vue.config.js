const { defineConfig } = require('@vue/cli-service')
const { ModuleFederationPlugin } = require('webpack').container
const { name } = require('./package.json')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: 'auto',
  configureWebpack: {
    // entry: { app: './src/bootstrap.js' },
    // target: ['web', 'es5'],
    output: {
      // 必须与主应用 registerMicroApps 的 name 一致，qiankun 通过 window[name] 读取生命周期
      library: name + '-app',
      libraryTarget: 'umd',
      globalObject: 'window',
      chunkLoadingGlobal: `webpackJsonp_${name}`,
      environment: {
        asyncFunction: false
      }
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'child2',
        filename: 'remoteEntry.js',
        remotes: {
          child1: 'child1@http://localhost:8081/remoteEntry.js'
        }
      })
    ]
  },
  devServer: {
    port: 8082,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    },
    allowedHosts: 'all'
  }
})
