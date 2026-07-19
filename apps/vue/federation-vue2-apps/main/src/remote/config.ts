import type { RemoteModule } from './types'

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

const appEnvConfig = parseAppEnvQuery()

function getRemoteEntryUrl(name: string, devHost: string): string {
  // 通过 query 参数 ?appenv=dev,app1,app2 控制生产包加载开发模式子应用
  const useDevServer = appEnvConfig.enabled
    ? appEnvConfig.apps.size === 0 || appEnvConfig.apps.has(name)
    : process.env.NODE_ENV === 'development'

  return useDevServer ? `${devHost}/remoteEntry.js` : `./${name}/remoteEntry.js`
}

/** 已接入主应用的联邦子应用清单 */
export const REMOTE_MODULES: RemoteModule[] = [
  {
    name: 'app1',
    entry: getRemoteEntryUrl('app1', 'http://localhost:9981')
  },
  {
    name: 'app2',
    entry: getRemoteEntryUrl('app2', 'http://localhost:9982')
  }
]

export const remoteModuleMap = REMOTE_MODULES.reduce<Record<string, RemoteModule>>((map, remote) => {
  map[remote.name] = remote
  return map
}, {})

export function getRemoteAppNames(): string[] {
  return REMOTE_MODULES.map((remote) => remote.name)
}

export function getRemoteModule(name: string): RemoteModule | undefined {
  return remoteModuleMap[name]
}
