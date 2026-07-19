<template>
	<view class="page">
		<view class="banner">
			<text class="t1">父子路由说明</text>
			<text class="t2">
				本页位于分包 root：<text class="code">pages/nested</text>。子页通过
				uni.navigateTo 打开；子页路径仍为 /pages/nested/xxx，与普通页面一致。
			</text>
		</view>

		<button class="btn primary" @click="toChildA">进入子页 A（query: from=parent）</button>
		<button class="btn" @click="toChildB">进入子页 B</button>

		<button class="btn ghost" @click="back">返回首页</button>
	</view>
</template>

<script setup>
function toChildA() {
	uni.navigateTo({
		url: "/pages/nested/child-a?from=parent&ts=" + Date.now(),
	});
}

function toChildB() {
	uni.navigateTo({ url: "/pages/nested/child-b" });
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
.banner {
	background: #fff;
	border-radius: 16rpx;
	padding: 28rpx;
	margin-bottom: 28rpx;
}
.t1 {
	display: block;
	font-size: 32rpx;
	font-weight: 600;
	color: #0f172a;
	margin-bottom: 16rpx;
}
.t2 {
	font-size: 26rpx;
	color: #64748b;
	line-height: 1.6;
}
.code {
	font-family: ui-monospace, monospace;
	color: #4f46e5;
}
.btn {
	margin-bottom: 20rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
}
.btn.primary {
	background: #4f46e5;
	color: #fff;
}
.btn.ghost {
	background: transparent;
	color: #64748b;
}
</style>
