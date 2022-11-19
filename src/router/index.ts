import type { App } from 'vue'
import type { AppRouteRecordRaw } from './types'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { normalRoutes, WHITE_NAME_LIST } from './routes'

export const routes: AppRouteRecordRaw[] = [
  ...normalRoutes,
  {
    component: () => import('@/layout/default.vue'),
    path: '/',
    redirect: '/dashboard',
    children: [
      {
        name: 'dashboard',
        path: '/dashboard/:page*',
        component: () => import('@/views/ivyadmin/home.vue'),
        meta: {
          title: '控制台',
          icon: 'example',
        },
      },
      {
        name: 'analysis',
        path: '/analysis/:page*',
        component: () => import('@/views/ivyadmin/analysis.vue'),
        meta: {
          title: '控制台',
          icon: 'example',
        },
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as unknown as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function resetRouter() {
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
