// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  // 开发工具
  devtools: { 
    enabled: false 
  }, 
  modules: [
    // element-ui
    '@element-plus/nuxt',
    '@pinia/nuxt' // npm i pinia @pinia/nuxt
  ],
  plugins: [
    '~/plugins/element-plus',
  ],
  // 开发服务
  devServer: {
    port: 3000,
    host: '0.0.0.0', // 让别人能访问我
  },
  elementPlus: {  

  },
  // 生产环境
  $production: {
    
  },
  // 开发环境
  $development: {
    
  },
})
