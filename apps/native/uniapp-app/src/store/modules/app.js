import { defineStore } from "pinia";

const PROFILE_STORAGE_KEY = "enterprise_demo_profile";

export const useAppStore = defineStore("app", {
	state: () => ({
		count: 0,
		profileName: "访客",
		initialized: false,
	}),
	getters: {
		doubleCount: (state) => state.count * 2,
		greeting: (state) => `你好，${state.profileName}`,
	},
	actions: {
		initialize() {
			if (this.initialized) return;

			try {
				const profile = uni.getStorageSync(PROFILE_STORAGE_KEY);
				if (profile?.name) this.profileName = profile.name;
			} catch (error) {
				console.warn("读取用户状态失败", error);
			} finally {
				this.initialized = true;
			}
		},
		increment(step = 1) {
			this.count += step;
		},
		resetCount() {
			this.count = 0;
		},
		updateProfileName(name) {
			this.profileName = name.trim() || "访客";
			try {
				uni.setStorageSync(PROFILE_STORAGE_KEY, { name: this.profileName });
				return true;
			} catch (error) {
				console.warn("保存用户状态失败", error);
				return false;
			}
		},
	},
});
