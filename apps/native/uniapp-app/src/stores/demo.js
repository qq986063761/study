import { defineStore } from "pinia";

/** 全局演示用 store：计数 + 昵称，展示 getters / actions */
export const useDemoStore = defineStore("demo", {
	state: () => ({
		count: 0,
		nickname: "访客",
	}),
	getters: {
		doubleCount: (state) => state.count * 2,
		greeting: (state) => `你好，${state.nickname}`,
	},
	actions: {
		increment(step = 1) {
			this.count += step;
		},
		reset() {
			this.count = 0;
		},
		setNickname(name) {
			this.nickname = (name || "").trim() || "访客";
			try {
				uni.setStorageSync("demo_nickname", this.nickname);
			} catch (e) {
				console.warn("setStorageSync failed", e);
			}
		},
		restoreFromStorage() {
			try {
				const n = uni.getStorageSync("demo_nickname");
				if (n) this.nickname = n;
			} catch (e) {
				console.warn("getStorageSync failed", e);
			}
		},
	},
});
