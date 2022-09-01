import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'

export function configSvgIconsPlugin(isBuild: boolean) {
  return createSvgIconsPlugin({
    iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
    symbolId: 'icon-[dir]-[name]',
    svgoOptions: isBuild,
    inject: 'body-last',
    customDomId: '__svg__icons__dom__',
  })
}
