import {
  API_BASE_URLS,
  APP_MENUS,
  WORKSPACE_APP_MAP,
  type ApiEnv,
  type AppName,
  type DashboardMetric,
  type DashboardSummary,
} from '@monorepo-vue3-app/constants'
import { clamp, sleep } from '@monorepo-vue3-app/utils'

export interface RequestClientOptions {
  env?: ApiEnv
  headers?: Record<string, string>
}

export function createRequestClient(options: RequestClientOptions = {}) {
  const baseUrl = API_BASE_URLS[options.env ?? 'development']

  return async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...init.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`)
    }

    return response.json() as Promise<T>
  }
}

export function createMockDashboardSummary(appName: AppName): DashboardSummary {
  const app = WORKSPACE_APP_MAP[appName]
  const seed = appName.length * 17
  const activeUsers = clamp(seed * 128, 1200, 9800)

  const metrics: DashboardMetric[] = [
    {
      label: 'Active users',
      value: activeUsers,
      trend: app.platform === 'mobile' ? 'up' : 'stable',
    },
    {
      label: 'Conversion',
      value: app.platform === 'mobile' ? 8.6 : 12.4,
      unit: '%',
      trend: 'up',
    },
    {
      label: 'Open issues',
      value: appName === 'admin' ? 7 : 3,
      trend: appName === 'admin' ? 'down' : 'stable',
    },
  ]

  return {
    appName,
    title: `${app.label} workspace summary`,
    updatedAt: new Date().toISOString(),
    metrics,
    menus: APP_MENUS[appName],
  }
}

export async function fetchDashboardSummary(appName: AppName): Promise<DashboardSummary> {
  await sleep(80)
  return createMockDashboardSummary(appName)
}

export const dashboardApi = {
  getSummary: fetchDashboardSummary,
}
