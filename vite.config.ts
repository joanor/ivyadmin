import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'

import { createVitePlugins } from './build/vite/plugins'
import { configAlias } from './build/vite/alias'
import { createProxy } from './build/vite/proxy'
import { wrapperEnv } from './build/vite/utils'

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const viteEnv = wrapperEnv(env)

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv

  const isBuild = command === 'build'
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      ...configAlias(),
    },
    server: {
      host: true,
      open: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      // minify:'terser',
      // terserOptions: {
      //   compress: {
      //     keep_infinity: true,
      //     // Used to delete console in production environment
      //     drop_console: VITE_DROP_CONSOLE,
      //   },
      // },
      chunkSizeWarningLimit: 2000,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use './src/styles/modules' as *;`,
        },
      },
    },
    plugins: [...createVitePlugins(viteEnv, isBuild)],
    optimizeDeps: {
      include: ['@vue/runtime-core', '@vue/shared'],
    },
  }
}
