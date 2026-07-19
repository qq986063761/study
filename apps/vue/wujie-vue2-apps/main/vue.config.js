const { defineConfig } = require('@vue/cli-service')
const { ModuleFederationPlugin } = require('webpack').container

const getRemote = (moduleName) => {
  return `promise new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = window.__REMOTES__['${moduleName}'];
    script.type = 'text/javascript';
    script.onload = () => {
      // 代理对象：透传 get/init 给远端容器
      const proxy = {
        get: (request) => window['${moduleName}'].get(request),
        init: (arg) => {
          try { return window['${moduleName}'].init(arg); } catch (e) { /* already initialized */ }
        }
      };
      resolve(proxy);
    };
    script.onerror = (e) => {
      console.error('Failed to load remote ${moduleName}:', script.src, e);
    };
    document.head.appendChild(script);
  })`
}

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: 'auto',
  configureWebpack: {
    target: ["web", "es5"],
    output: {
      environment: {
        asyncFunction: true
      }
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "main",
        filename: "remoteEntry.js",
        // 依赖其他应用
        remotes: {
          "child1": getRemote('child1'),
        }
      }),
    ],
  },
})
