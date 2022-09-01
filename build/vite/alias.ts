import type { AliasOptions } from 'vite'
import { resolve } from 'path'

const pathResolve = (dir: string) => {
  return resolve(process.cwd(), '.', dir)
}

export function configAlias(): {
  alias: AliasOptions
} {
  return {
    alias: [
      {
        find: '@',
        replacement: pathResolve('src'),
      },
      {
        find: '@views',
        replacement: pathResolve('src/views'),
      },
      {
        find: '@styles',
        replacement: pathResolve('src/styles'),
      },
    ],
  }
}
