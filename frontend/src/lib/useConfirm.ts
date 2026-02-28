import { ref, createApp, h } from 'vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

interface ConfirmOptions {
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      const container = document.createElement('div')
      document.body.appendChild(container)

      const open = ref(true)

      const cleanup = () => {
        app.unmount()
        document.body.removeChild(container)
      }

      const app = createApp({
        render() {
          return h(ConfirmDialog, {
            open: open.value,
            title: options.title,
            message: options.message,
            confirmText: options.confirmText,
            cancelText: options.cancelText,
            variant: options.variant ?? 'danger',
            onConfirm: () => {
              open.value = false
              setTimeout(cleanup, 200)
              resolve(true)
            },
            onCancel: () => {
              open.value = false
              setTimeout(cleanup, 200)
              resolve(false)
            },
          })
        },
      })

      app.mount(container)
    })
  }

  return { confirm }
}
