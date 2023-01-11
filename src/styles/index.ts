import 'uno.css'
import 'normalize.css'
import { autoImport } from '@/libs/utils'

export function setupStyles() {
  autoImport(
    import.meta.glob(['./main.scss', './**/*', '!./modules/**/*'], {
      eager: true,
      // query: '?inline',
    })
  )
}
