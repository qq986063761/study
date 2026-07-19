import { createApp } from 'vue'
import { createPinia } from 'pinia'
import WujieVue from 'wujie-vue3'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(WujieVue)

app.mount('#app')
