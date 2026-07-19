import type { App } from 'vue';
import ElementPlus, { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus';
import 'element-plus/dist/index.css';

export default (app: App) => {
  app.use(ElementPlus);
  app.provide(ID_INJECTION_KEY, { prefix: 100, current: 0 });
  app.provide(ZINDEX_INJECTION_KEY, { current: 0 });
};
