import { registerMicroApps, start } from 'qiankun'

const microApps = [
  {
    name: 'app1',
    entry: '//localhost:5174',
    container: '#subapp-container',
    activeRule: '/app1',
  },
  {
    name: 'app2',
    entry: '//localhost:5175',
    container: '#subapp-container',
    activeRule: '/app2',
  },
]

let started = false

export function setupMicroApps() {
  if (started) return

  registerMicroApps(microApps)
  start({ prefetch: false })
  started = true
}
