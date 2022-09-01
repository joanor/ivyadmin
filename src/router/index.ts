import type { App } from 'vue'
import type { AppRouteRecordRaw } from './types'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { normalRoutes, WHITE_NAME_LIST } from './routes'

export const routes: AppRouteRecordRaw[] = [...normalRoutes]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes as unknown as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function resetRouter() {
  console.log(`执行resetRouter`, router.getRoutes())
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export function setupRouter(app: App<Element>) {
  app.use(router)
}
