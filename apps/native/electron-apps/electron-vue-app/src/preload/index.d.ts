import { ElectronAPI } from '@electron-toolkit/preload'

export interface SystemInfo {
  appVersion: string
  electronVersion: string
  chromiumVersion: string
  nodeVersion: string
  platform: string
  release: string
  arch: string
  hostname: string
  locale: string
  theme: string
  homePath: string
  documentsPath: string
}

export interface TextDocument {
  path: string
  name: string
  content: string
}

export interface DesktopAPI {
  getSystemInfo: () => Promise<SystemInfo>
  openTextFile: () => Promise<TextDocument | null>
  saveTextFile: (
    path: string | null,
    content: string
  ) => Promise<Pick<TextDocument, 'path' | 'name'> | null>
  readClipboard: () => Promise<string>
  writeClipboard: (text: string) => Promise<void>
  notify: (body: string) => Promise<boolean>
}

declare global {
  interface Window {
    electron: ElectronAPI
    desktop: DesktopAPI
  }
}
