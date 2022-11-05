/**
 * 与弹框相关的操作
 * 包括打开dialog、关闭弹框等操作
 */

import { reactive, toRefs } from 'vue'

export default function () {
  const data = reactive({
    dialogVisiable: false, // 弹框是否打开
    dialogTitle: '', // 弹框的标题
  })

  // 打开dialog——open
  const onOpenDialog = (callback?: () => void) => {
    callback && callback()
  }

  // 打开动画结束之后——opened
  const onOpenedDialog = (callback?: () => void) => {
    callback && callback()
  }

  // 关闭dialog——close
  const onBeforeCloseDialog = (callback?: () => void) => {
    callback && callback()
  }

  // 关闭dialog——关闭前的回调，会暂停 Dialog 的关闭. 回调函数内执行 done 参数方法的时候才是真正关闭对话框的时候.
  const onCloseDialog = (callback?: () => void) => {
    callback && callback()
  }

  // 关闭动画结束时——closed
  const onClosedDialog = (callback?: () => void) => {
    callback && callback()
  }

  // 输入焦点聚焦在 Dialog 内容时的回调
  const onOpenAutoFocus = (callback?: () => void) => {
    callback && callback()
  }

  // 输入焦点从 Dialog 内容失焦时的回调
  const onCloseAutoFocus = (callback?: () => void) => {
    callback && callback()
  }

  return {
    ...toRefs(data),
    onOpenDialog,
    onOpenedDialog,
    onBeforeCloseDialog,
    onCloseDialog,
    onClosedDialog,
    onOpenAutoFocus,
    onCloseAutoFocus,
  }
}
