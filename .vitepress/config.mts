import {
  createReadStream,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'node:fs'
import { dirname, extname, join, relative } from 'node:path'
import { defineConfig } from 'vitepress'
import type { Plugin } from 'vite'

const projectRoot = process.cwd()

/** 笔记目录：其中的 .html / .js / .css 等作为 demo 静态资源提供 */
const DEMO_ROOTS = [
  '前端',
  '基础',
  'AI',
  '后端',
  'CI-CD',
  '操作系统',
  '版本控制',
  '科学上网',
  '第三方平台',
]

const STATIC_EXT = new Set([
  '.html',
  '.js',
  '.mjs',
  '.cjs',
  '.css',
  '.json',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.map',
  '.wasm',
  '.mp4',
  '.webm',
  '.pdf',
])

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.cjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
  '.wasm': 'application/wasm',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
}

function isDemoRel(rel: string) {
  return DEMO_ROOTS.some((d) => rel === d || rel.startsWith(`${d}/`))
}

/** 开发态提供 demo 静态文件；构建后拷贝到 dist，使深层 HTML demo 可直接打开 */
function htmlDemosPlugin(): Plugin {
  let outDir = join(projectRoot, '.vitepress/dist')
  let base = '/'

  return {
    name: 'study-html-demos',
    configResolved(config) {
      outDir = config.build.outDir
      base = config.base || '/'
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || req.method !== 'GET' && req.method !== 'HEAD') {
          return next()
        }
        let urlPath = decodeURIComponent(req.url.split('?')[0])
        if (base !== '/' && urlPath.startsWith(base)) {
          urlPath = '/' + urlPath.slice(base.length)
        }
        if (
          urlPath.startsWith('/@') ||
          urlPath.startsWith('/node_modules') ||
          urlPath.startsWith('/.vitepress')
        ) {
          return next()
        }
        const rel = urlPath.replace(/^\//, '')
        if (!isDemoRel(rel)) return next()

        const filePath = join(projectRoot, rel)
        if (!existsSync(filePath) || !statSync(filePath).isFile()) {
          return next()
        }
        const ext = extname(filePath).toLowerCase()
        if (!STATIC_EXT.has(ext)) return next()

        res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
        if (req.method === 'HEAD') {
          res.end()
          return
        }
        createReadStream(filePath).pipe(res)
      })
    },
    closeBundle() {
      const walk = (dir: string) => {
        for (const name of readdirSync(dir)) {
          if (
            name === 'node_modules' ||
            name === '.git' ||
            name === '.vitepress' ||
            name === 'dist'
          ) {
            continue
          }
          const p = join(dir, name)
          const st = statSync(p)
          if (st.isDirectory()) {
            walk(p)
            continue
          }
          const ext = extname(p).toLowerCase()
          if (!STATIC_EXT.has(ext)) continue
          const rel = relative(projectRoot, p).replace(/\\/g, '/')
          if (!isDemoRel(rel)) continue
          const dest = join(outDir, rel)
          mkdirSync(dirname(dest), { recursive: true })
          cpSync(p, dest)
        }
      }
      for (const d of DEMO_ROOTS) {
        const p = join(projectRoot, d)
        if (existsSync(p)) walk(p)
      }
    },
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Study',
  description: '前端学习笔记',
  // 学习笔记中常有未完成的相对链接，构建时忽略死链
  ignoreDeadLinks: true,
  // GitHub Pages 项目站：https://qq986063761.github.io/study/
  base: '/study/',

  vite: {
    plugins: [htmlDemosPlugin()],
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '基础', link: '/基础/', activeMatch: '/基础/' },
      { text: '前端', link: '/前端/', activeMatch: '/前端/' },
    ],

    sidebar: {
      '/基础/': [
        {
          text: '基础',
          items: [{ text: '概览', link: '/基础/' }],
        },
        {
          text: '语言',
          collapsed: false,
          items: [
            { text: 'HTML', link: '/基础/html/readme' },
            { text: 'CSS', link: '/基础/css/readme' },
            {
              text: 'JavaScript',
              collapsed: true,
              items: [
                { text: '概览', link: '/基础/javascript/readme' },
                { text: 'ES5', link: '/基础/javascript/es5' },
                { text: 'ES6', link: '/基础/javascript/es6' },
                { text: '事件循环', link: '/基础/javascript/事件循环' },
                { text: '正则表达式', link: '/基础/javascript/正则表达式' },
              ],
            },
            { text: 'TypeScript', link: '/基础/typescript/README' },
            { text: 'Dart', link: '/基础/dart/readme' },
            { text: 'WebGL', link: '/基础/WebGL/readme' },
          ],
        },
        {
          text: '浏览器与网络',
          collapsed: false,
          items: [
            { text: '浏览器', link: '/基础/浏览器' },
            { text: '网络', link: '/基础/网络' },
            { text: '移动端', link: '/基础/移动端' },
            { text: '兼容', link: '/基础/兼容' },
            { text: '服务器', link: '/基础/服务器' },
            { text: '系统', link: '/基础/系统' },
          ],
        },
        {
          text: '工程与规范',
          collapsed: true,
          items: [
            { text: '开发规范', link: '/基础/开发规范' },
            { text: '优化', link: '/基础/优化/readme' },
          ],
        },
        {
          text: '算法与模式',
          collapsed: true,
          items: [
            { text: '数据结构', link: '/基础/数据结构/readme' },
            { text: '算法', link: '/基础/算法/readme' },
            { text: '设计模式', link: '/基础/设计模式/readme' },
          ],
        },
      ],

      '/前端/': [
        {
          text: '前端',
          items: [{ text: '概览', link: '/前端/' }],
        },
        {
          text: '框架与库',
          collapsed: false,
          items: [
            {
              text: 'Vue',
              collapsed: true,
              items: [
                { text: 'Vue 2.x', link: '/前端/vue/2.x' },
                { text: 'Vue 3.x', link: '/前端/vue/3.x' },
              ],
            },
            { text: 'React', link: '/前端/react/README' },
            { text: 'Angular', link: '/前端/angular/readme' },
            { text: 'Astro', link: '/前端/astro/readme' },
            { text: 'jQuery', link: '/前端/jquery/readme' },
            { text: 'Three.js', link: '/前端/three.js/readme' },
            { text: 'Require.js', link: '/前端/require.js/readme' },
          ],
        },
        {
          text: '工程与架构',
          collapsed: true,
          items: [
            { text: '架构', link: '/前端/架构' },
            { text: '规范与工具', link: '/前端/readme' },
            { text: '微前端', link: '/前端/微前端/readme' },
            { text: '性能监控', link: '/前端/性能监控/readme' },
            { text: '博客', link: '/前端/博客/readme' },
            { text: '管理后台模版', link: '/前端/管理后台项目模版/readme' },
            { text: '原生 App', link: '/前端/原生app/readme' },
            { text: 'CSS', link: '/前端/css/readme' },
            { text: '移动端', link: '/前端/移动端/readme' },
          ],
        },
        {
          text: '业务场景',
          collapsed: false,
          items: [
            {
              text: '富文本',
              collapsed: false,
              items: [
                { text: '概览', link: '/前端/富文本/readme' },
                { text: 'Native', link: '/前端/富文本/native/README' },
                { text: 'Quill', link: '/前端/富文本/quill/readme' },
                { text: 'wangEditor', link: '/前端/富文本/wangEditor/readme' },
                { text: 'TinyMCE', link: '/前端/富文本/TinyMCE/readme' },
                { text: 'TipTap', link: '/前端/富文本/TipTap/readme' },
                { text: 'ProseMirror', link: '/前端/富文本/ProseMirror/readme' },
                { text: 'Slate.js', link: '/前端/富文本/Slate.js/readme' },
                { text: 'CKEditor', link: '/前端/富文本/CKEditor/readme' },
                { text: 'editor.js', link: '/前端/富文本/editor.js/readme' },
                { text: 'jodit', link: '/前端/富文本/jodit/readme' },
                { text: 'simditor', link: '/前端/富文本/simditor/readme' },
                { text: 'summernote', link: '/前端/富文本/summernote/readme' },
                { text: 'suneditor', link: '/前端/富文本/suneditor/readme' },
              ],
            },
            {
              text: '拖拽',
              link: '/前端/拖拽/readme',
            },
            {
              text: '表格',
              link: '/前端/表格/readme',
            },
            {
              text: '地图',
              collapsed: true,
              items: [
                { text: '高德地图', link: '/前端/地图/高德地图/README' },
                { text: '百度地图', link: '/前端/地图/百度地图/readme' },
              ],
            },
            {
              text: '在线预览',
              collapsed: true,
              items: [
                { text: '概览', link: '/前端/在线预览/readme' },
                { text: 'PhotoSwipe', link: '/前端/在线预览/photoswipe/readme' },
              ],
            },
            { text: '视频播放', link: '/前端/视频播放/readme' },
            {
              text: '日期日历',
              collapsed: true,
              items: [
                { text: '概览', link: '/前端/日期日历/readme' },
                { text: 'FullCalendar', link: '/前端/日期日历/fullcalendar/readme' },
                { text: 'Day.js', link: '/前端/日期日历/day.js/readme' },
              ],
            },
            {
              text: '下载',
              collapsed: true,
              items: [
                { text: '概览', link: '/前端/下载/readme' },
                { text: 'xlsx', link: '/前端/下载/xlsx/readme' },
                { text: 'html2canvas', link: '/前端/下载/html2canvas/README' },
              ],
            },
            { text: '请求 · Axios', link: '/前端/请求数据/axios/README' },
            {
              text: 'iframe',
              collapsed: true,
              items: [
                { text: '概览', link: '/前端/iframe/readme' },
                { text: '方法传递方案', link: '/前端/iframe/方法传递方案' },
              ],
            },
            { text: '弹窗 · Popper', link: '/前端/弹窗/popper.js/readme' },
            { text: '轮播 · Swiper', link: '/前端/轮播/swiper/readme' },
            { text: '二维码', link: '/前端/二维码/qrcode.js/readme' },
            { text: 'Fullpage', link: '/前端/页面效果/fullpage/readme' },
            {
              text: '动画',
              collapsed: true,
              items: [
                { text: '概览', link: '/前端/动画/readme' },
                { text: 'Lottie', link: '/前端/动画/lottie/readme' },
              ],
            },
            { text: '加载', link: '/前端/加载/readme' },
            { text: '帮助引导', link: '/前端/帮助引导/readme' },
            { text: '可视化', link: '/前端/可视化/readme' },
            { text: '图片处理', link: '/前端/图片处理/readme' },
            {
              text: '数值',
              collapsed: true,
              items: [
                { text: '概览', link: '/前端/数值/readme' },
                { text: 'numeral', link: '/前端/数值/numeral/readme' },
                { text: 'countUp', link: '/前端/数值/countUp/readme' },
              ],
            },
            { text: '字符串', link: '/前端/字符串/readme' },
            {
              text: '系统热键',
              collapsed: true,
              items: [
                { text: '概览', link: '/前端/系统热键指令/readme' },
                { text: 'hotkeys', link: '/前端/系统热键指令/hotkeys/readme' },
                {
                  text: 'screenfull',
                  link: '/前端/系统热键指令/screenfull.js/readme',
                },
              ],
            },
            { text: '分割面板', link: '/前端/分割面板/readme' },
            { text: '溢出隐藏', link: '/前端/溢出隐藏/readme' },
            {
              text: '滚动',
              collapsed: true,
              items: [
                { text: '概览', link: '/前端/滚动/readme' },
                { text: 'better-scroll', link: '/前端/滚动/better-scroll/readme' },
              ],
            },
            { text: '粘性布局', link: '/前端/粘性布局/readme' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://gitee.com/wanpeng666/study' },
    ],

    search: {
      provider: 'local',
    },

    outline: {
      label: '本页目录',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
})
