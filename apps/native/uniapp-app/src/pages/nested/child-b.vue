<template>
	<view class="page">
		<view class="panel">
			<text class="title">子页 B</text>
			<text class="line">演示：用 reLaunch 清空栈并回首页（也可改用 navigateBack）。</text>
		</view>
		<button class="btn" @click="backStep">仅返回上一页</button>
		<button class="btn primary" @click="home">reLaunch 到首页</button>
	</view>
</template>

<script setup>
function backStep() {
	uni.navigateBack();
}

function home() {
	uni.reLaunch({ url: "/pages/index/index" });
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	padding: 28rpx;
	background: #eff6ff;
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
	color: #1e3a8a;
}
.line {
	font-size: 26rpx;
	color: #475569;
	line-height: 1.6;
}
.btn {
	margin-bottom: 20rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
}
.btn.primary {
	background: #2563eb;
	color: #fff;
}
</style>
