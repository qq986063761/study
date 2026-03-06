const path = require('path')

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/theme.scss";`  // 全局 SCSS 文件路径
      }
    }
  },
  // 配置 Webpack 别名
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       '@': path.resolve(__dirname, 'src'),  // 确保 src 的别名已定义
  //     }
  //   }
  // },
  devServer: {
    host: '0.0.0.0', // 允许外部访问
  },
};
