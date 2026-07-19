<template>
	<view class="page">
		<view class="panel">
			<text class="title">子页 A</text>
			<text class="line">onLoad 参数：{{ queryText }}</text>
			<text class="line">可与 Pinia 共享：{{ greeting }}（count={{ count }}）</text>
		</view>
		<button class="btn" @click="add">在本页 +1（全局 store）</button>
		<button class="btn primary" @click="back">uni.navigateBack</button>
	</view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { useDemoStore } from "@/stores/demo.js";

const queryText = ref("-");
const store = useDemoStore();
const { count, greeting } = storeToRefs(store);

onLoad((q) => {
	queryText.value = JSON.stringify(q || {});
});

function add() {
	store.increment();
}

function back() {
	uni.navigateBack();
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	padding: 28rpx;
	background: #f0fdf4;
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
	margin-bottom: 16rpx;
	color: #14532d;
}
.line {
	display: block;
	font-size: 26rpx;
	color: #334155;
	margin-bottom: 12rpx;
	word-break: break-all;
}
.btn {
	margin-bottom: 20rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
}
.btn.primary {
	background: #16a34a;
	color: #fff;
}
</style>
