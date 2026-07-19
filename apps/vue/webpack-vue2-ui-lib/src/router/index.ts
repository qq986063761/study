import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Overview from "../views/Overview.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "overview",
    component: Overview,
    meta: { title: "概览", icon: "🏠" },
  },
  {
    path: "/button",
    name: "button",
    component: () =>
      import(/* webpackChunkName: "button-demo" */ "../views/ButtonDemo.vue"),
    meta: { title: "Button 按钮", icon: "🔘" },
  },
  {
    path: "/input",
    name: "input",
    component: () =>
      import(/* webpackChunkName: "input-demo" */ "../views/InputDemo.vue"),
    meta: { title: "Input 输入框", icon: "✏" },
  },
  {
    path: "/dialog",
    name: "dialog",
    component: () =>
      import(/* webpackChunkName: "dialog-demo" */ "../views/DialogDemo.vue"),
    meta: { title: "Dialog 对话框", icon: "💬" },
  },
];

const router = new VueRouter({
  routes,
  linkActiveClass: "is-active",
});

export default router;
