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
    // redirect: '/app-vite:page*',
    redirect: '/app_user_overview',
    name: 'dashboard',
    children: [
      {
        name: 'appUserOverview',
        path: '/app_user_overview/:page*',
        component: () => import('@/views/scmain/app_user_overview/index.vue'),
        meta: {
          title: '用户概览',
          icon: 'example',
        },
      },
      {
        name: 'appEnergyAnalysis',
        path: '/app_energy_analysis/:page*',
        component: () => import('@/views/scmain/app_energy_analysis/index.vue'),
        meta: {
          title: '用能分析',
          icon: 'example',
        },
      },
      {
        name: 'appCarbonEsmissionMonitor',
        path: '/app_carbon_esmission_monitor/:page*',
        component: () =>
          import('@/views/scmain/app_carbon_esmission_monitor/index.vue'),
        meta: {
          title: '碳排放监测',
          icon: 'example',
        },
      },
      {
        name: 'appEnergyStorage',
        path: '/app_energy_storage/:page*',
        component: () => import('@/views/scmain/app_energy_storage/index.vue'),
        meta: {
          title: '光伏储能',
          icon: 'example',
        },
      },
      {
        name: 'appEquipmentMonitor',
        path: '/app_equipment_monitor/:page*',
        component: () =>
          import('@/views/scmain/app_equipment_monitor/index.vue'),
        meta: {
          title: '设备监控',
          icon: 'example',
        },
      },
      {
        name: 'appOmManager',
        path: '/app_om_manager/:page*',
        component: () => import('@/views/scmain/app_om_manager/index.vue'),
        meta: {
          title: '运维管理（采集）',
          icon: 'example',
        },
      },
      {
        name: 'appDataManager',
        path: '/app_data_manager/:page*',
        component: () => import('@/views/scmain/app_data_manager/index.vue'),
        meta: {
          title: '数据管理',
          icon: 'example',
        },
      },
      {
        name: 'appNotificationManagert',
        path: '/app_notification_manager/:page*',
        component: () =>
          import('@/views/scmain/app_notification_manager/index.vue'),
        meta: {
          title: '通知管理',
          icon: 'example',
        },
      },
      {
        name: 'appDeviceReserveManager',
        path: '/app_device_manager/:page*',
        component: () => import('@/views/scmain/app_device_manager/index.vue'),
        meta: {
          title: '设备存储管理',
          icon: 'example',
        },
      },
      {
        name: 'appSystemManager',
        path: '/app_system_manager/:page*',
        component: () => import('@/views/scmain/app_system_manager/index.vue'),
        meta: {
          title: '系统管理',
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
