import { createApp } from 'vue'
import App from './App.vue'

import { router, setupRouter } from './router' // 路由
import { setupRouterGuard } from './middleware' // 路由导航守卫
import { setupStyles } from './styles' // 样式
import { setupStore } from './store' // pinia
import './plugins' // 插件

// 仿nest.js启动
async function bootstrap() {
  const app = createApp(App)

  setupStore(app)

  setupRouter(app)

  setupRouterGuard(router)

  setupStyles()

  app.mount('#app')
}

bootstrap()
