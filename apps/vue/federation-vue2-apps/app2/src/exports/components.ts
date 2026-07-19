// app2 组件联邦入口，key 即主应用全局组件名，value 保持异步加载器以继续细分 chunk
export default {
  'app2-card': () => import(/* webpackChunkName: "app2-card" */ '../components/App2Card.vue')
}
