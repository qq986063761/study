<template>
	<view class="page">
		<view class="section">
			<text class="label">交互</text>
			<button class="btn" @click="onToast">uni.showToast</button>
			<button class="btn" @click="onModal">uni.showModal</button>
			<button class="btn" @click="onLoading">uni.showLoading（1.2s 后 hide）</button>
		</view>

		<view class="section">
			<text class="label">存储（同步）</text>
			<button class="btn" @click="saveStorage">写入 demo_key</button>
			<button class="btn" @click="readStorage">读取 demo_key</button>
			<text class="hint">{{ storageHint }}</text>
		</view>

		<view class="section">
			<text class="label">系统信息（getSystemInfoSync 摘要）</text>
			<view class="mono">
				<text>{{ sysLines }}</text>
			</view>
		</view>

		<view class="section">
			<text class="label">路由</text>
			<button class="btn primary" @click="goHome">uni.navigateBack 或 reLaunch 首页</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from "vue";

const storageHint = ref("尚未读取");

const sysLines = computed(() => {
	try {
		const s = uni.getSystemInfoSync();
		return [
			`platform: ${s.platform}`,
			`model: ${s.model || "-"}`,
			`window: ${s.windowWidth}×${s.windowHeight}`,
			`statusBar: ${s.statusBarHeight}px`,
		].join("\n");
	} catch (e) {
		return String(e);
	}
});

function onToast() {
	uni.showToast({ title: "操作成功", icon: "success", duration: 1500 });
}

function onModal() {
	uni.showModal({
		title: "确认",
		content: "这是一个 Modal 示例",
		success(res) {
			uni.showToast({
				title: res.confirm ? "点了确定" : "点了取消",
				icon: "none",
			});
		},
	});
}

function onLoading() {
	uni.showLoading({ title: "加载中…", mask: true });
	setTimeout(() => {
		uni.hideLoading();
		uni.showToast({ title: "已结束", icon: "none" });
	}, 1200);
}

function saveStorage() {
	try {
		uni.setStorageSync("demo_key", `hello-${Date.now()}`);
		storageHint.value = "已写入 demo_key";
	} catch (e) {
		storageHint.value = String(e);
	}
}

function readStorage() {
	try {
		const v = uni.getStorageSync("demo_key");
		storageHint.value = v === "" ? "空字符串" : String(v);
	} catch (e) {
		storageHint.value = String(e);
	}
}

function goHome() {
	const pages = getCurrentPages();
	if (pages.length > 1) {
		uni.navigateBack({ delta: 1 });
	} else {
		uni.reLaunch({ url: "/pages/index/index" });
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	padding: 24rpx;
	background: #f5f6f8;
	box-sizing: border-box;
}
.section {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
}
.label {
	display: block;
	font-size: 26rpx;
	color: #64748b;
	margin-bottom: 20rpx;
}
.btn {
	margin-bottom: 16rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
}
.btn:last-of-type {
	margin-bottom: 0;
}
.btn.primary {
	background: #4f46e5;
	color: #fff;
}
.hint {
	display: block;
	margin-top: 12rpx;
	font-size: 24rpx;
	color: #0f172a;
	word-break: break-all;
}
.mono {
	font-size: 24rpx;
	color: #334155;
	line-height: 1.6;
	white-space: pre-wrap;
}
</style>
