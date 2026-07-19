export const WORKSPACE_APP_MAP = {
  admin: {
    name: 'admin',
    label: 'Admin Console',
    platform: 'pc',
    description: 'Internal operations, permissions, and business management.',
    owner: 'Back Office Team',
  },
  web: {
    name: 'web',
    label: 'Web Portal',
    platform: 'pc',
    description: 'Public desktop site and authenticated user portal.',
    owner: 'Growth Team',
  },
  h5: {
    name: 'h5',
    label: 'Mobile H5',
    platform: 'mobile',
    description: 'Mobile-first pages for campaign, share, and lightweight flows.',
    owner: 'Mobile Team',
  },
} as const

export type AppName = keyof typeof WORKSPACE_APP_MAP
export type Platform = (typeof WORKSPACE_APP_MAP)[AppName]['platform']

export const WORKSPACE_APPS = Object.values(WORKSPACE_APP_MAP)

export interface MenuItem {
  label: string
  path: string
  permission?: string
}

export const APP_MENUS: Record<AppName, readonly MenuItem[]> = {
  admin: [
    { label: 'Dashboard', path: '/', permission: 'admin:dashboard' },
    { label: 'Users', path: '/users', permission: 'admin:users' },
    { label: 'Settings', path: '/settings', permission: 'admin:settings' },
  ],
  web: [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Account', path: '/account' },
  ],
  h5: [
    { label: 'Home', path: '/' },
    { label: 'Campaign', path: '/campaign' },
    { label: 'Profile', path: '/profile' },
  ],
}

export const API_BASE_URLS = {
  development: '/api',
  test: 'https://test-api.example.com',
  production: 'https://api.example.com',
} as const

export type ApiEnv = keyof typeof API_BASE_URLS

export interface DashboardMetric {
  label: string
  value: number
  unit?: string
  trend: 'up' | 'down' | 'stable'
}

export interface DashboardSummary {
  appName: AppName
  title: string
  updatedAt: string
  metrics: DashboardMetric[]
  menus: readonly MenuItem[]
}
