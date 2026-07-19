/**
 * 使用 Webpack5 Module Federation 时，qiankun 需要从入口直接拿到生命周期函数。
 * 本文件作为入口，通过动态 import 从 main 暴露 bootstrap/mount/unmount。
 */
const promise = import('./main')

export const bootstrap = () => promise.then((m) => m.bootstrap())
export const mount = (props) => promise.then((m) => m.mount(props))
export const unmount = () => promise.then((m) => m.unmount())
