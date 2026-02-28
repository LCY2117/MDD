import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import App from './App.vue'

// 样式
import './styles/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#root')
