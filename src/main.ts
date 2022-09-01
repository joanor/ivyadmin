import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { router, setupRouter } from './router'
import { setupRouterGuard } from './middleware'
import { setupStyles } from './styles'
import { setupStore } from './store'

async function bootstrap() {
  const app = createApp(App)

  // store
  setupStore(app)

  // 路由
  setupRouter(app)

  // 导航守卫
  setupRouterGuard(router)

  // 样式
  setupStyles()

  app.mount('#app')
}

bootstrap()
