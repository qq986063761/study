<template>
	<view class="page">
		<view class="panel">
			<text class="title">Pinia：useDemoStore</text>
			<text class="line">count：{{ count }}</text>
			<text class="line">getter doubleCount：{{ doubleCount }}</text>
			<text class="line">{{ greeting }}</text>
		</view>

		<view class="panel">
			<text class="label">修改昵称（会同步到 uni.setStorageSync）</text>
			<input
				class="input"
				v-model="nameInput"
				placeholder="输入昵称"
				confirm-type="done"
			/>
			<button class="btn" @click="applyName">保存昵称</button>
		</view>

		<view class="row">
			<button class="btn flex" type="primary" @click="store.increment()">+1</button>
			<button class="btn flex" type="warn" @click="store.increment(5)">+5</button>
			<button class="btn flex" @click="store.reset()">归零</button>
		</view>

		<button class="btn ghost" @click="back">返回上一页</button>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useDemoStore } from "@/stores/demo.js";

const store = useDemoStore();
const { count, doubleCount, greeting } = storeToRefs(store);
const nameInput = ref(store.nickname);

onMounted(() => {
	store.restoreFromStorage();
	nameInput.value = store.nickname;
});

function applyName() {
	store.setNickname(nameInput.value);
}

function back() {
	uni.navigateBack();
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	padding: 28rpx;
	background: #f5f6f8;
	box-sizing: border-box;
}
.panel {
	background: #fff;
	border-radius: 16rpx;
	padding: 28rpx;
	margin-bottom: 24rpx;
}
.title {
	display: block;
	font-size: 32rpx;
	font-weight: 600;
	margin-bottom: 20rpx;
	color: #0f172a;
}
.line {
	display: block;
	font-size: 28rpx;
	color: #334155;
	margin-bottom: 12rpx;
}
.label {
	display: block;
	font-size: 26rpx;
	color: #64748b;
	margin-bottom: 16rpx;
}
.input {
	border: 1px solid #e2e8f0;
	border-radius: 12rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	font-size: 28rpx;
}
.btn {
	border-radius: 12rpx;
	font-size: 28rpx;
	margin-bottom: 16rpx;
}
.row {
	display: flex;
	gap: 16rpx;
	margin-bottom: 24rpx;
}
.btn.flex {
	flex: 1;
	margin-bottom: 0;
}
.btn.ghost {
	background: transparent;
	color: #4f46e5;
	border: 1px solid #c7d2fe;
}
</style>
