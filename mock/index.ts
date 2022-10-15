import type { MockMethod } from 'vite-plugin-mock'

// 启动mock数据
export default [
  {
    url: '/api/login',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          name: 'xixi',
        },
      }
    },
  },
] as MockMethod[]
