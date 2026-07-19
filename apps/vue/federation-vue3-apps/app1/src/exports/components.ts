// app1 组件联邦入口：key 即主应用全局组件名，value 保持异步加载器。
export default {
  'app1-card': () => import('../components/App1Card.vue'),
}
