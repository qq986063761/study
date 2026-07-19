const path = require('path')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        // boneyard-js 未在 package exports 中暴露 shared/types，供 Vue2 包装组件使用
        'boneyard-shared': path.resolve(__dirname, 'node_modules/boneyard-js/dist/shared.js'),
        'boneyard-types': path.resolve(__dirname, 'node_modules/boneyard-js/dist/types.js')
      }
    }
  }
})




















// const { defineConfig } = require('@vue/cli-service')
// const path = require('path')
// const glob = require('glob')
// const webpack = require('webpack')
// const CopyPlugin = require('copy-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const isLocal = process.argv && process.argv.includes('--local')
// const isVersion3 = process.argv && process.argv.includes('--version3')
// const isV3 = process.argv && process.argv.includes('--v3')
// const isNingDe = process.argv && process.argv.includes('--ningde')
// const isWx = process.argv && process.argv.includes('--wx')
// const isPkgDev = process.argv && process.argv.includes('--dev')

// // 打包指定模块
// const pkgArg = process.argv && 
//   process.argv.find(arg => arg.includes('--pkg')) || ''
// const pkgKey = pkgArg.split(',')[1]

// // 模块
// const allTeamKeys = ['ad', 'de', 'mk', 'mz', 'pa', 'ob', 'demo']
// const modKeyTeamKeyMap = {}
// const allModKeys = []
// allTeamKeys.map(key => {
//   // 找团队目录下所有子模块
//   const moduleDirs = glob.sync(path.join('src', key, '*'))
//   moduleDirs.map(filepath => {
//     const filename = filepath.replace(`src/${key}/`, '')
//     if (!filename.includes('.')) {
//       allModKeys.push(filename)
//       modKeyTeamKeyMap[filename] = key
//     }
//   })
// })

// let moduleKeys = [] // 包含的模块
// let excludeModuleKeys = [] // 排除的模块
// const moduleArg = process.argv && 
//   process.argv.find(arg => arg.includes('--module')) || ''
// if (moduleArg) {
//   moduleKeys = moduleArg.split(',').slice(1)
//   moduleKeys.push('demo')
//   allModKeys.map(key => {
//     if (!moduleKeys.includes(key)) {
//       excludeModuleKeys.push(key)
//     }
//   })
// } else {
//   moduleKeys = allModKeys.slice()
//   excludeModuleKeys = []
// }

// // 生产环境去掉 demo 模块
// if (process.env.NODE_ENV === 'production') {
//   const index = moduleKeys.indexOf('demo')
//   if (index !== -1) {
//     excludeModuleKeys.push(moduleKeys.splice(index, 1)[0])
//   }
// }

// // 外部模块
// let outMods = []
// const outModAtg = process.argv && 
//   process.argv.find(arg => arg.includes('--outmod')) || ''
// if (outModAtg) {
//   argSplitArr = outModAtg.split(',')
//   outMods = argSplitArr.slice(1)
// }

// function resolve (dir) {
//   return path.join(__dirname, dir)
// }

// // 项目根目录
// let rootPath = '/web/'

// // 灰度版本
// if (isVersion3) rootPath = '/version3' + rootPath
// // 宁德私有化根目录
// if (isV3) rootPath = '/v3' + rootPath
// // 宁德那边映射后的根目录
// const ningDeRootPath = '/come-app/okr-pc/' // 'gateway/outside/ipaas/OKR/outer_OKR_web/'

// module.exports = defineConfig({
//   productionSourceMap: false,
//   publicPath: rootPath, // 项目访问根目录
//   outputDir: `dist${rootPath.slice(0, rootPath.length - 1)}`, // 文件输出目录
//   assetsDir: 'static', // 资源放的目录
//   // 需要编译的 node_modules 中的包
//   transpileDependencies: true,
//   css: {
//     loaderOptions: {
//       sass: {
//         additionalData: `
//           @import "@/common/assets/css/theme/theme.scss";
//           @import "@/common/assets/css/theme/mixin.scss";
//         `
//       }
//     }
//   },
//   configureWebpack: config => {
//     // 部分模块单独打包
//     if (pkgKey) {
//       config.output.library = {
//         name: `${pkgKey}Pkg`,
//         type: 'var',
//         export: 'default',
//       }
//       config.output.filename = `static/${pkgKey}/${isPkgDev ? 'dev/' : ''}[name].js`
//       config.output.chunkFilename = `static/${pkgKey}/${isPkgDev ? 'dev/' : ''}[name].js`
//       config.entry = {
//         index: `./src/${modKeyTeamKeyMap[pkgKey]}/${pkgKey}/export.js`,
//       }
      
//       // 组件打包排除一些用不到的包
//       for (let i = config.plugins.length - 1; i >= 0; i--) {
//         const plugin = config.plugins[i]
//         if (plugin instanceof CopyPlugin ||
//             plugin instanceof HtmlWebpackPlugin) {
//           config.plugins.splice(i, 1)
//         }
//       }
//       return
//     }
    
//     // 为生产环境修改配置...
//     if (process.env.NODE_ENV === 'production') {
      
//     } else { // 为开发环境修改配置...
      
//     }

//     // 不打包到 dist 的模块
//     if (excludeModuleKeys.length) {
//       config.plugins.push(new webpack.IgnorePlugin({
//         resourceRegExp: new RegExp(`^\\./(${excludeModuleKeys.join('|')})/`)
//       }))
//     }
//   },
//   chainWebpack: config => {
//     // 为生产环境修改配置...
//     if (process.env.NODE_ENV === 'production') {
//       // 图片资源的 src 属性访问路径
//       if (!isLocal) {
//         const getImgPath = filename => {
//           const moduleName = filename.split('src/')[1].split('/')[0]
//           return `static/img/${moduleName}/`
//         }

//         const imgGenerator = {
//           filename: '[name][ext]',
//           publicPath: ({ filename }) => {
//             return `https://zxb-online.oss-cn-beijing.aliyuncs.com/${getImgPath(filename)}`
//           },
//           outputPath: ({ filename }) => {
//             return getImgPath(filename)
//           }
//         }
        
//         config.module
//           .rule('svg')
//           .set('generator', imgGenerator)
//           .end()

//         config.module
//           .rule('images')
//           .set('generator', imgGenerator)
//           .end()
//       }
//     } else { // 为开发环境修改配置...
      
//     }
    
//     // 别名
//     config.resolve.alias
//       .set('element-ui', resolve('src/common/components/element-ui'))
    
//     // 其他依赖包兼容，因为 webpack 中已经不提供一些包了
//     config.resolve.set('fallback', {
//       stream: require.resolve("stream-browserify"),
//       timers: false, // require.resolve("timers-browserify"),
//       crypto: false, // require.resolve("crypto-browserify"),
//       path: false, // require.resolve("path-browserify"),
//       http: false, // require.resolve("stream-http"),
//       fs: false, //
//       https: false // require.resolve("https-browserify")
//     })

//     config.plugin('define')
//       .tap(args => {
//       args[0]['process.env'].moduleKeys = moduleKeys.map(val => `"${val}"`)
//       args[0]['process.env'].outModKeys = outMods.map(val => `"${val}"`)

//       return args
//     })

//     // 部分模块单独打包
//     if (pkgKey) {
//       config.plugin('extract-css').tap(args => {
//         args[0].filename = `static/${pkgKey}/${isPkgDev ? 'dev/' : ''}[name].css`
//         args[0].chunkFilename = `static/${pkgKey}/${isPkgDev ? 'dev/' : ''}[name].css`
//         return args
//       })
//       return
//     }
    
//     // html 配置修改
//     config
//       .plugin('html')
//       .tap(args => {
//         var isDev = process.env.NODE_ENV !== 'production'
//         var ajaxRoot = isDev ? '' : '' // /v3 请求的根路径

//         // 私有化用户需要的密钥
//         let deipaaskeyauth = ''
//         let isNingDeTest = false

//         if (isV3) {
//           // 测试
//           if (process.argv.includes('--test')) {
//             // 测试密钥
//             isNingDeTest = true
//             deipaaskeyauth = 's49vNfERu418Ra55LMYN805l3rxSe7D2'
//           } else {
//             // 线上密钥
//             deipaaskeyauth = '95U549sgDm0207Z19Ff043272o4833Qs'
//           }
//         }

//         // 这里注意，宁德这种私有化用户，要按他们的来写访问地址
//         let path = isNingDe ? ningDeRootPath : rootPath
//         let script = `
//           <script src="${path}static/lib/axios.min.js"></script>
//           <script>
//             var deipaaskeyauth = '${deipaaskeyauth}';
//             var isNingDeTest = ${isNingDeTest};
//             var isDev = ${isDev};
//             var ajaxRoot = '${ajaxRoot}';
//           </script>`

//         // 微信 sdk
//         if (isWx) {
//           script += `
//             <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js" referrerpolicy="origin"></script>
//             <script src="https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js" referrerpolicy="origin"></script>
//             <script src="${path}static/lib/wx/sdk-v0.1.1.js"></script>
//           `
//         } else { // 钉钉人事一体化
//           script += `
//             <script>
//               window.__BIRD_CONFIG = window.__BIRD_CONFIG || {};
//               __BIRD_CONFIG.pageName = 'Hrm_isv_OKR_pekhr-OkrIFramePC';
//             </script>
//             <script src="https://o.alicdn.com/dingding/dingtalk-microapp-sdk/index.js"></script>
//           `
//         }

//         // 需要其他模块资源
//         let appScript = `<script src="${path}static/env.js"></script>`
//         outMods.map(key => {
//           appScript += `
//             <script src="./static/${key}/index.js"></script>
//           `
//         })
        
//         args[0].libScript = script // 第三方库
//         args[0].appScript = appScript // 业务
        
//         return args
//       })
//   },
// })
