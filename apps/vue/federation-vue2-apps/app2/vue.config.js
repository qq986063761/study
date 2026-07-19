const { defineConfig } = require('@vue/cli-service')
const { ModuleFederationPlugin } = require('webpack').container

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: 'auto',
  devServer: {
    port: process.env.VUE_APP_PORT,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  configureWebpack: {
    ...(process.env.NODE_ENV === 'development' ? {
      optimization: {
        splitChunks: false // 必须，不然 main 引入报错
      }
    } : {}),
    plugins: [
      new ModuleFederationPlugin({
        name: 'app2',
        filename: 'remoteEntry.js',
        exposes: {
          './routes': './src/exports/routes.ts',
          './store': './src/exports/store.ts',
          './ajax': './src/exports/ajax.ts',
          './i18n': './src/exports/i18n.ts',
          './components': './src/exports/components.ts',
          './global-components': './src/exports/global-components.ts'
        },
        shared: {
          '@main/runtime': {
            import: false,
            shareKey: '@main/runtime',
            singleton: true,
            requiredVersion: false
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
