/**
 * Federation 运行时插件（factory 函数）
 *
 * 通过 @module-federation/vite 的 runtimePlugins 配置加载。
 * Vite 插件生成的 bootstrap 代码会以 `pluginFactory()` 形式调用，
 * 因此必须导出 factory 函数而非插件对象。
 *
 * 用法：在 vite.config.ts 的 federation() 中配置：
 *   runtimePlugins: ['./src/federation-runtime-plugin.ts'],
 *
 * 核心原理：
 *   @module-federation/vite 将源码中的 import('app1/routes') 编译期转换为
 *   __loadRemote__("app1/routes") 调用，底层走 loadRemote() API。
 *   loadRemote() 会先 runtime.registerRemotes([...]) 注册 remote，
 *   本插件拦截 beforeRegisterRemote 钩子，动态修改 entry URL。
 *
 * appenv query 参数（方便开发）：
 *   在生产构建的 main 上添加查询参数，让 main 加载本地开发服务中的子应用：
 *     ?appenv=dev          → 所有子应用都用本地开发服务
 *     ?appenv=dev,app1     → 仅 app1 用本地开发服务
 *     ?appenv=dev,app1,app2 → app1、app2 都用本地开发服务
 */

import type { ModuleFederationRuntimePlugin } from '@module-federation/runtime'
import type { RemoteWithEntry } from '@module-federation/sdk'

/** 开发环境下各子应用的端口号 */
const REMOTE_DEV_PORTS: Record<string, number> = {
  app1: 9981,
  app2: 9982,
}

/**
 * 解析 appenv query 参数，返回 { enabled, apps }
 *
 * enabled=true 表示启用了 appenv 模式；
 * apps.size===0 表示所有子应用都用开发服务；
 * apps.size>0 表示只有 Set 中的子应用用开发服务。
 */
function parseAppEnvQuery(): { enabled: boolean; apps: Set<string> } {
  try {
    const params = new URLSearchParams(window.location.search)
    const appenv = params.get('appenv')
    if (!appenv) return { enabled: false, apps: new Set() }

    const parts = appenv.split(',')
    if (parts[0] !== 'dev') return { enabled: false, apps: new Set() }

    // 仅 'dev'：所有子应用都用开发服务；'dev,app1,app2'：仅指定应用用开发服务
    if (parts.length === 1) return { enabled: true, apps: new Set() }
    return { enabled: true, apps: new Set(parts.slice(1)) }
  } catch {
    return { enabled: false, apps: new Set() }
  }
}

/**
 * 根据运行环境解析 remote entry URL
 *
 * 解析优先级：
 *   1. appenv query 参数（?appenv=dev,app1）：生产包也能加载本地开发子应用
 *   2. development 模式
 *   3. production 环境读取 window.__REMOTE_CONFIG__
 *   4. 兜底：相对路径 ./{name}/remoteEntry.js
 */
function resolveRemoteEntry(name: string, env: string): string {
  const port = REMOTE_DEV_PORTS[name]

  // 判断是否使用本地开发服务
  const useDevServer = env === 'development' || 
    appEnvConfig.enabled && 
    (appEnvConfig.apps.size === 0 || appEnvConfig.apps.has(name))

  if (useDevServer && port) {
    return `http://localhost:${port}/remoteEntry.js`
  }

  // 生产环境：可从 window.__REMOTE_CONFIG__ 读取部署地址
  const runtimeConfig = (
    window as unknown as { __REMOTE_CONFIG__?: Record<string, string> }
  ).__REMOTE_CONFIG__

  return runtimeConfig?.[name] ?? `./${name}/remoteEntry.js`
}

const appEnvConfig = parseAppEnvQuery()

/**
 * 插件 factory 函数
 *
 * @module-federation/vite 生成的 bootstrap 代码为：
 *   const __browserPlugins = [$runtimePlugin_0(undefined)];
 * 因此 default export 必须是一个函数，返回 ModuleFederationRuntimePlugin 对象。
 */
export default function dynamicRemotesPlugin(): ModuleFederationRuntimePlugin {
  return {
    name: 'dynamic-remotes',
    beforeRegisterRemote(args) {
      const env = import.meta.env.MODE
      const newEntry = resolveRemoteEntry(args.remote.name, env);
      
      // Remote 类型为 RemoteWithEntry | RemoteWithVersion 的联合，entry 属性仅在
      // RemoteWithEntry 上存在。此处断言为 RemoteWithEntry，因为 vite 插件编译期
      // 生成的 remote 配置必定包含 entry。
      // SyncWaterfallHook 通过原地修改 payload 生效，无需 return。
      (args.remote as RemoteWithEntry).entry = newEntry
    },
  }
}
