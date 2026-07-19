export type MicroAppName = 'app1' | 'app2'

export interface MicroAppConfig {
  name: MicroAppName
  label: string
  url: string
  port: number
  summary: string
}

export const microApps: Record<MicroAppName, MicroAppConfig> = {
  app1: {
    name: 'app1',
    label: 'App1',
    url: import.meta.env.VITE_APP1_URL || 'http://localhost:8081/',
    port: 8081,
    summary: '业务应用一',
  },
  app2: {
    name: 'app2',
    label: 'App2',
    url: import.meta.env.VITE_APP2_URL || 'http://localhost:8082/',
    port: 8082,
    summary: '业务应用二',
  },
}

export const microAppList = Object.values(microApps)
