import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { configCompressPlugin } from './compress'
import { configSvgIconsPlugin } from './svgSprite'
import { configHtmlPlugin } from './html'
import { configStyleImportPlugin } from './styleImport'
import { configThemePlugin } from './theme'
import { configUnocssPlugin } from './unocss'
import { configMockServerPlugin } from './mockServer'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
  } = viteEnv

  const vitePlugins: PluginOption | PluginOption[] = [
    vue({
      template: {
        compilerOptions: {
          /**
           * 在使用微前端microapp的时候
           * 注册自定义组件micro-app 防止控制台警告
           */
          isCustomElement: tag => /^micro-app/.test(tag),
        },
      },
    }),
    // jsx和tsx
    vueJsx(),
    // 在setup语法糖上添加name属性
    vueSetupExtend(),
    // element plus自动引入组件
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ['ant-design'],
        }),
        ElementPlusResolver(),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    configUnocssPlugin(),
  ]

  // @vitejs/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy())

  // vite-plugin-mock
  const mockServerPlugin = configMockServerPlugin(isBuild)
  !isBuild && mockServerPlugin && vitePlugins.push(mockServerPlugin)

  // vite-plugin-style-import
  vitePlugins.push(configStyleImportPlugin())

  // vite-plugin-theme
  vitePlugins.push(configThemePlugin())

  // vite-plugin-html
  const htmlPlugin = configHtmlPlugin(viteEnv, isBuild)
  vitePlugins.push(htmlPlugin)

  // vite-plugin-svg-icons
  const svgIconsPlugin = configSvgIconsPlugin(isBuild)
  vitePlugins.push(svgIconsPlugin)

  // rollup-plugin-gzip
  const compressPlugin = configCompressPlugin(
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
  )
  isBuild && compressPlugin && vitePlugins.push(compressPlugin)

  return vitePlugins
}
