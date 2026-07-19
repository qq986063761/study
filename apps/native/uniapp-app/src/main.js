import { createSSRApp } from "vue";
import App from "./App.vue";
import { createStore } from "@/store/index.js";

export function createApp() {
	const app = createSSRApp(App);
	app.use(createStore());
	return {
		app,
	};
}
