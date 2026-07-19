<template>
	<view class="page-shell">
		<view class="page-header">
			<text class="page-kicker">STORE / MODULES / APP</text>
			<text class="page-title">全局状态</text>
			<text class="page-description">{{ greeting }}</text>
		</view>

		<view class="metric-strip metric-strip--light">
			<view class="metric-item">
				<text class="metric-value">{{ count }}</text>
				<text class="metric-label">当前值</text>
			</view>
			<view class="metric-item">
				<text class="metric-value">{{ doubleCount }}</text>
				<text class="metric-label">派生值</text>
			</view>
		</view>

		<view class="form-panel">
			<text class="field-label">用户昵称</text>
			<input v-model="profileName" class="text-input" maxlength="20" placeholder="输入昵称" confirm-type="done" />
			<button class="action-button action-button--primary" @click="saveProfile">保存到本地</button>
		</view>

		<view class="action-row">
			<button class="action-button" @click="store.increment()">+1</button>
			<button class="action-button" @click="store.increment(5)">+5</button>
			<button class="action-button action-button--danger" @click="store.resetCount()">重置</button>
		</view>

		<button class="text-button" @click="backOrHome()">返回</button>
	</view>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { backOrHome } from "@/router/index.js";
import { useAppStore } from "@/store/modules/app.js";

const store = useAppStore();
const { count, doubleCount, greeting } = storeToRefs(store);
const profileName = ref("");

onMounted(() => {
	store.initialize();
	profileName.value = store.profileName;
});

function saveProfile() {
	const saved = store.updateProfileName(profileName.value);
	profileName.value = store.profileName;
	uni.showToast({ title: saved ? "已保存" : "保存失败", icon: saved ? "success" : "none" });
}
</script>
