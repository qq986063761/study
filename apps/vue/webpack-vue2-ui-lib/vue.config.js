const { defineConfig } = require("@vue/cli-service");

// 检测是否为 lib 模式构建（--target lib）
// npm run build → vue-cli-service build（无 --target）
// npm run build:lib → vue-cli-service build --target lib ...
const isLibMode =
  process.argv.includes("--target") && process.argv.includes("lib");

module.exports = defineConfig({
  // lib 模式输出到 lib/，demo 构建输出到 dist/
  outputDir: isLibMode ? "lib" : "dist",

  publicPath: "./",

  // CSS 提取为独立文件
  css: {
    extract: true,
    sourceMap: true,
  },

  // 为库构建保留 sourceMap
  productionSourceMap: true,

  // 确保 babel 转译所有依赖
  transpileDependencies: true,

  chainWebpack: (config) => {
    if (isLibMode) {
      // 让 UMD/CommonJS 全局直接指向 default export，
      // 这样 Vue.use(window['webpack-vue2-ui-lib']) 无需 .default
      config.output.libraryExport("default");
    }
  },

  // configureWebpack 拿到的 config 是 chainWebpack 执行完 + Vue CLI lib 追加插件后的最终配置
  // Vue CLI 的 resolveLibConfig 会在 chainWebpack 之后追加 demo-html 插件，所以在这里删
  configureWebpack: (config) => {
    if (isLibMode) {
      const HtmlWebpackPlugin = require("html-webpack-plugin");
      config.plugins = config.plugins.filter(
        (p) => !(p instanceof HtmlWebpackPlugin)
      );
    }
  },
});
