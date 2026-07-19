// UI 组件库入口文件
// 用于 vue-cli-service build --target lib 构建

import UiButton from "./components/Button.vue";
import UiInput from "./components/Input.vue";
import UiDialog from "./components/Dialog.vue";
import UiMenu from "./components/Menu.vue";

// 按需引入时使用
export { UiButton, UiInput, UiDialog, UiMenu };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default {
  // 组件引用，供按需使用：window['webpack-vue2-ui-lib'].UiButton
  UiButton,
  UiInput,
  UiDialog,
  UiMenu,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  install(Vue: any): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const comps: Record<string, any> = { UiButton, UiInput, UiDialog, UiMenu };
    Object.keys(comps).forEach((name) => {
      Vue.component(name, comps[name]);
    });
  },
};

// 导出类型（方便 TypeScript 用户）
export type { default as UiButtonType } from "./components/Button.vue";
export type { default as UiInputType } from "./components/Input.vue";
export type { default as UiDialogType } from "./components/Dialog.vue";
export type { default as UiMenuType } from "./components/Menu.vue";
