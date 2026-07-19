import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/index.scss";

// 全量注册组件库（dev 预览用）
import UI from "./index";
Vue.use(UI);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
