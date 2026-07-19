<template>
	<view class="page">
		<view class="hero">
			<text class="hero-title">uni-app Vue3 Demo</text>
			<text class="hero-sub">Pinia：{{ greeting }} · count={{ count }} · 双倍={{ doubleCount }}</text>
		</view>

		<view class="card">
			<text class="card-title">功能入口</text>
			<button class="btn primary" @click="goApi">uni API 演示</button>
			<button class="btn" @click="goStore">Pinia 状态管理</button>
			<button class="btn" @click="goParent">父子路由（分包）</button>
		</view>

		<view class="card row">
			<button class="btn sm" type="default" @click="store.increment()">+1</button>
			<button class="btn sm" type="warn" @click="store.reset()">归零</button>
		</view>
	</view>
</template>

<script setup>
import { onShow } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { useDemoStore } from "@/stores/demo.js";

const store = useDemoStore();
const { count, doubleCount, greeting } = storeToRefs(store);

onShow(() => {
	store.restoreFromStorage();
});

function goApi() {
	uni.navigateTo({ url: "/pages/api-demo/index" });
}
function goStore() {
	uni.navigateTo({ url: "/pages/store-demo/index" });
}
function goParent() {
	uni.navigateTo({ url: "/pages/nested/parent" });
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	padding: 32rpx;
	box-sizing: border-box;
	background: linear-gradient(180deg, #eef2ff 0%, #f5f6f8 40%);
}
.hero {
	margin-bottom: 40rpx;
}
.hero-title {
	display: block;
	font-size: 40rpx;
	font-weight: 600;
	color: #1e293b;
	margin-bottom: 16rpx;
}
.hero-sub {
	font-size: 26rpx;
	color: #64748b;
	line-height: 1.5;
}
.card {
	background: #fff;
	border-radius: 20rpx;
	padding: 28rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 8rpx 32rpx rgba(15, 23, 42, 0.06);
}
.card-title {
	display: block;
	font-size: 28rpx;
	font-weight: 600;
	color: #334155;
	margin-bottom: 24rpx;
}
.btn {
	margin-bottom: 20rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
}
.btn:last-child {
	margin-bottom: 0;
}
.btn.primary {
	background: #4f46e5;
	color: #fff;
}
.row {
	display: flex;
	gap: 20rpx;
	align-items: center;
}
.btn.sm {
	flex: 1;
	margin-bottom: 0;
}
</style>
