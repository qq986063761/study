// app1 全局弹窗类组件入口，key 用作 ui.app1(key, method, params) 的第一个参数
export default {
  modal: () => import(/* webpackChunkName: "app1-global-modal" */ '../components/modal.vue')
}
