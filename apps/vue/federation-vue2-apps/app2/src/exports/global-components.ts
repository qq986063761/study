// app2 全局弹窗类组件入口，key 用作 ui.app2(key, method, params) 的第一个参数
export default {
  modal: () => import(/* webpackChunkName: "app2-global-modal" */ '../components/modal.vue')
}
