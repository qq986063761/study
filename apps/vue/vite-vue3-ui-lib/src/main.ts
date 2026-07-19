import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 全量注册组件库（dev 预览用）
import { install } from './index'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use({ install })

app.mount('#app')
