import { viteMockServe } from 'vite-plugin-mock'

export function configMockServerPlugin(isBuild: boolean) {
  return viteMockServe({
    mockPath: './mock',
    localEnabled: !isBuild,
    prodEnabled: false,
    supportTs: true,
  })
}
