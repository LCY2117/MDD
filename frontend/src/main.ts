import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import App from './App.vue'
import { useAuthStore } from './stores/auth'

// 样式
import './styles/index.css'
import '../node_modules/vue-sonner/lib/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 先校验 token，挂载前完成，这样路由守卫拿到的 isAuthenticated 才正确
const auth = useAuthStore()
auth.init().finally(() => {
  app.mount('#root')
})
