import { http } from '@/plugins/request'
import { defineStore } from 'pinia'

export {}

export const useGlobalStore = defineStore('globals', {
  state: () => ({}),
  getters: {},
  actions: {
    getServerTime() {
      http
        .get(
          {
            url: 'api/date',
          },
          {
            joinPrefix: true,
            urlPrefix: `${window.config.basic_url}`,
          }
        )
        .then(res => {
          console.log(`getServerTime=>`, res)
        })
    },
  },
})
