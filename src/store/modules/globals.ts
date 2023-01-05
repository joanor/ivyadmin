import { defineStore } from 'pinia'
import { DICT_FIELDS } from '@/libs/shared/constant'
import { DictType } from '@/libs/shared/types'

export const useGlobalStore = defineStore('globals', {
  state: () => ({
    tloading: false,
    dicts: {} as DictType,
  }),
  getters: {},
  actions: {
    toggleTableLoading() {
      this.tloading = !this.tloading
    },
  },
})
