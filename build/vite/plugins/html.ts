import { createHtmlPlugin } from 'vite-plugin-html'
import pkg from '../../../package.json'

function getAppConfigSrc(path: string) {
  return `${path || '/'}_app.config.js?v=${pkg.version}-${new Date().getTime()}`
}

export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH } = env

  return createHtmlPlugin({
    minify: isBuild,
    inject: {
      data: {
        title: VITE_GLOB_APP_TITLE,
      },
      tags: isBuild
        ? [
            {
              tag: 'script',
              attrs: {
                src: getAppConfigSrc(
                  VITE_PUBLIC_PATH.endsWith('/')
                    ? VITE_PUBLIC_PATH
                    : `${VITE_PUBLIC_PATH}/`
                ),
              },
            },
          ]
        : [],
    },
  })
}
