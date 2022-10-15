import 'uno.css'
import 'normalize.css'
import 'animate.css'
import { autoImport } from '../libs/utils'

export function setupStyles() {
  autoImport(import.meta.glob(['./*', '!./var.scss'], { eager: true }))
}
