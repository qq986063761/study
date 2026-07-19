import { createI18n } from 'vue-i18n'
import { getRemoteAppNames, loadRemoteI18n } from './sub-app-loader'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': {
      main: {
        message: '这是来自 main 的中文语言资源',
      },
    },
    'en-US': {
      main: {
        message: 'This English message comes from main',
      },
    },
  },
})

/**
 * 加载子应用暴露的裸 messages，由 main 按子应用名补命名空间前缀后再 merge。
 * 子应用只需导出 { 'zh-CN': { message: '...' }, ... }，无需自行包一层 app1/app2。
 * 合并后可在任意视图通过 t('app1.message') / t('app2.message') 使用。
 */
export async function registerRemoteI18nMessages(): Promise<void> {
  await Promise.all(
    getRemoteAppNames().map(async (app) => {
      try {
        const messages = await loadRemoteI18n(app)
        Object.keys(messages).forEach((locale) => {
          i18n.global.mergeLocaleMessage(locale, {
            [app]: messages[locale],
          })
        })
      } catch (err) {
        console.warn(`[main] 子应用 ${app} 的 i18n 语言资源加载失败:`, err)
      }
    }),
  )
}

export default i18n
