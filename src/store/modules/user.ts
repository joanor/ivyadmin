import { http } from '@/plugins/request'
import { defineStore } from 'pinia'
import store from 'store2'
import { SYS_CONSTANT } from '@/libs/constant'

export interface LoginForm {
  loginName: string
  password: string
}

interface Token {
  token: string
}

interface UserInfo {
  companyId: string
  companyName: string
  departId: string
  departName: string
  id: string
  userName: string
  loginName: string
  userStatus: string
  userMobile: string
  updateUser: string
  updateTime: string
  [x: string]: string | number
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {} as UserInfo,
  }),
  getters: {},
  actions: {
    loginByUser(data: LoginForm): Promise<boolean> {
      return new Promise((resolve, reject) => {
        http
          .get<Token>({
            url: `api/login`,
            // data,
          })
          .then(res => {
            console.log(`1234567890`)
            // store.set(SYS_CONSTANT.AUTH_TOKEN, res.token)
            resolve(true)
          })
          .catch(err => {
            console.error(err)
            reject(false)
          })
      })
    },
    async getUserInfo() {
      const res = await http.get<UserInfo>(
        {
          url: `api/users/current-user`,
        },
        {
          joinPrefix: true,
          urlPrefix: `${window.config.uaa_url}`,
        }
      )
      this.userInfo = res
    },
  },
})
