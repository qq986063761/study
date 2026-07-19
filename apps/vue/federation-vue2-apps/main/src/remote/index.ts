/**
 * 联邦远程模块统一出口
 *
 * 目录职责：
 * - config.ts            子应用清单 / 入口 URL / appenv
 * - container.ts         remoteEntry 脚本加载与 MF 容器 init/get
 * - modules.ts           各暴露模块（routes/store/ajax/i18n/components）加载
 * - sub-app.ts           完整子应用注册与路由懒加载守卫
 * - components.ts        联邦 UI 组件全局异步注册
 * - global-components.ts 命令式全局弹窗类组件
 * - i18n.ts              VueI18n 实例与远程语言资源合并
 * - types.ts             联邦相关类型
 */

export * from './config'
export * from './modules'
export * from './sub-app'
export * from './components'
export * from './global-components'
export { default as i18n, registerRemoteI18nMessages } from './i18n'
export * from './types'
