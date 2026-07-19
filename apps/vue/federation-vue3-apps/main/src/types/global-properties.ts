/**
 * 历史 globalProperties（$ajax / $store / $modal / $app1 / $app2）已废弃。
 * 命令式能力统一通过联邦 shared 模块 `@main/runtime` 显式引入：
 *
 *   // 子应用（consumer）请用默认导入
 *   import runtime from '@main/runtime'
 *   const { ajax, ui, store } = runtime
 *
 *   // 主应用内部建议相对路径，避免 dep prebundle 双实例
 *   import { ajax, ui, store } from '../runtime'
 *
 * 类型声明见项目根目录 types/main-runtime/index.d.ts。
 */
