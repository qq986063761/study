import { resolve } from 'path'
import { defineConfig } from 'vite'
import glob from 'glob'
import vue from '@vitejs/plugin-vue2'

const pages = glob.sync('./*/index.html')
const input = {}
pages.forEach(path => {
  const key = path.split('/')[1]
  input[key] = resolve(__dirname, path)
})

let base = 'web'
export default defineConfig(({ command, mode, ssrBuild }) => {
  // command === 'serve' // 开发环境
  return {
    base: '/' + base + '/', // 项目根服务路径
    build: {
      outDir: 'dist/' + base,
      rollupOptions: {
        // 页面入口
        input,
        // 输出
        output: {
          // 入口文件路径
          entryFileNames: ({facadeModuleId}) => {
            const pathArr = facadeModuleId.split('/')
            const root = pathArr[pathArr.length - 2]
            return `${root}/assets/[name].[hash].js`
          },
          // css 等资源路径
          assetFileNames: ({name}) => {
            const root = name.split('/')[0]
            return `${root}/assets/[name].[hash][extname]`
          },
          // 内部 chunk 路径，比如内部 import 的其他 js、node_modules 中的包
          chunkFileNames: ({facadeModuleId}) => {
            // 没有 facadeModuleId 表示是 node_modules 中的包
            const pathArr = facadeModuleId && 
              facadeModuleId.split('/') || []
            const root = pathArr[0] && 
              pathArr[pathArr.length - 2] || ''
            return `${root && `${root}/` || ''}assets/[name].[hash].js`
          },
          // 手动分割 chunk
          manualChunks: {
            vue: ['vue', 'vue-router']
          }
        }
      }
    },
    // 服务器配置
    server: {
      // 自动打开应用
      open: '/' + base + '/page1/index.html'
    },
    css: {
      // 预处理 css
      preprocessorOptions: {
        scss: {
          additionalData: `@import "/common/theme.scss";`
        }
      }
    },
    // 定义全局变量
    define: {
      __ROOT__: JSON.stringify(base),
      __APP__: JSON.stringify('Vite App')
    },
    resolve: {
      // 别名
      alias: {
        'p1': resolve(__dirname, './page1'),
        'p2': resolve(__dirname, './page2')
      }
    },
    plugins: [vue()]
  }
})