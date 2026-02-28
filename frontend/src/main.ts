import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import App from './App.vue'
import { Toaster } from 'vue-sonner'

// 样式
import './styles/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('Toaster', Toaster)

app.mount('#root')
