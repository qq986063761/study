<template>
	<view class="page-shell">
		<view class="page-header">
			<text class="page-kicker">UNI NATIVE API</text>
			<text class="page-title">原生能力工作台</text>
			<text class="page-description">{{ systemSummary }}</text>
		</view>

		<view class="section-heading">
			<text class="section-title">设备与网络</text>
			<text class="section-meta">{{ networkType }}</text>
		</view>
		<view class="action-row">
			<button class="action-button action-button--primary" @click="refreshEnvironment">刷新信息</button>
			<button class="action-button" @click="vibrate">短振动</button>
		</view>

		<view class="section-heading">
			<text class="section-title">界面交互</text>
			<text class="section-meta">反馈组件</text>
		</view>
		<view class="action-grid">
			<button class="action-button" @click="showToast">Toast</button>
			<button class="action-button" @click="showModal">Modal</button>
			<button class="action-button" @click="showActions">Action Sheet</button>
			<button class="action-button" @click="showLoading">Loading</button>
		</view>

		<view class="form-panel">
			<text class="field-label">本地存储</text>
			<input v-model="storageValue" class="text-input" maxlength="40" placeholder="输入要保存的内容" />
			<view class="action-row">
				<button class="action-button action-button--primary" @click="saveStorage">写入</button>
				<button class="action-button" @click="readStorage">读取</button>
				<button class="action-button action-button--danger" @click="removeStorage">删除</button>
			</view>
			<text class="inline-result">{{ storageResult }}</text>
		</view>

		<view class="form-panel">
			<text class="field-label">系统剪贴板</text>
			<input v-model="clipboardValue" class="text-input" maxlength="80" placeholder="输入要复制的内容" />
			<view class="action-row">
				<button class="action-button action-button--primary" @click="writeClipboard">复制</button>
				<button class="action-button" @click="readClipboard">读取</button>
			</view>
		</view>

		<view class="form-panel">
			<text class="field-label">媒体选择</text>
			<button class="action-button" @click="chooseImage">选择一张图片</button>
			<image v-if="imagePath" class="image-preview" :src="imagePath" mode="aspectFill" @click="previewImage" />
		</view>

		<view class="result-panel">
			<view class="result-heading">
				<text class="section-title">最近操作</text>
				<text class="status-badge status-badge--neutral">{{ lastApi }}</text>
			</view>
			<text class="code-block" selectable>{{ operationResult }}</text>
		</view>

		<button class="text-button" @click="backOrHome()">返回</button>
	</view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { backOrHome } from "@/router/index.js";

const STORAGE_KEY = "enterprise_demo_native_api";
const systemInfo = ref({});
const networkType = ref("未知网络");
const storageValue = ref("uni-app demo");
const storageResult = ref("尚未读取");
const clipboardValue = ref("来自 uni-app 的文本");
const imagePath = ref("");
const lastApi = ref("ready");
const operationResult = ref("等待操作");

const systemSummary = computed(() => {
	const info = systemInfo.value;
	if (!info.platform) return "正在读取设备信息";
	return `${info.platform} · ${info.model || "未知设备"} · ${info.windowWidth} × ${info.windowHeight}`;
});

onShow(() => {
	refreshEnvironment();
});

function record(api, result) {
	lastApi.value = api;
	operationResult.value = typeof result === "string" ? result : JSON.stringify(result, null, 2);
}

function refreshEnvironment() {
	uni.getSystemInfo({
		success(info) {
			systemInfo.value = info;
			record("getSystemInfo", {
				platform: info.platform,
				model: info.model,
				system: info.system,
				windowWidth: info.windowWidth,
				windowHeight: info.windowHeight,
			});
		},
		fail(error) {
			record("getSystemInfo", error.errMsg);
		},
	});
	uni.getNetworkType({
		success(result) {
			networkType.value = result.networkType;
		},
		fail() {
			networkType.value = "读取失败";
		},
	});
}

function vibrate() {
	if (typeof uni.vibrateShort !== "function") {
		record("vibrateShort", "当前平台不支持短振动");
		return;
	}

	uni.vibrateShort({
		success: () => record("vibrateShort", "振动调用成功"),
		fail: (error) => record("vibrateShort", error.errMsg),
	});
}

function showToast() {
	uni.showToast({ title: "操作成功", icon: "success" });
	record("showToast", "Toast 已显示");
}

function showModal() {
	uni.showModal({
		title: "业务确认",
		content: "确认执行当前演示操作？",
		success: (result) => record("showModal", result.confirm ? "用户确认" : "用户取消"),
	});
}

function showActions() {
	uni.showActionSheet({
		itemList: ["标记完成", "稍后处理", "取消关注"],
		success: (result) => record("showActionSheet", `选择索引：${result.tapIndex}`),
		fail: (error) => record("showActionSheet", error.errMsg),
	});
}

function showLoading() {
	uni.showLoading({ title: "处理中", mask: true });
	setTimeout(() => {
		uni.hideLoading();
		record("showLoading / hideLoading", "加载状态已关闭");
	}, 1000);
}

function saveStorage() {
	uni.setStorage({
		key: STORAGE_KEY,
		data: storageValue.value,
		success() {
			storageResult.value = "写入成功";
			record("setStorage", storageValue.value);
		},
		fail: (error) => record("setStorage", error.errMsg),
	});
}

function readStorage() {
	uni.getStorage({
		key: STORAGE_KEY,
		success(result) {
			storageValue.value = String(result.data);
			storageResult.value = `读取结果：${result.data}`;
			record("getStorage", result.data);
		},
		fail(error) {
			storageResult.value = "暂无数据";
			record("getStorage", error.errMsg);
		},
	});
}

function removeStorage() {
	uni.removeStorage({
		key: STORAGE_KEY,
		success() {
			storageResult.value = "已删除";
			record("removeStorage", "本地数据已删除");
		},
		fail: (error) => record("removeStorage", error.errMsg),
	});
}

function writeClipboard() {
	uni.setClipboardData({
		data: clipboardValue.value,
		success: () => record("setClipboardData", "文本已复制"),
		fail: (error) => record("setClipboardData", error.errMsg),
	});
}

function readClipboard() {
	uni.getClipboardData({
		success(result) {
			clipboardValue.value = result.data;
			record("getClipboardData", result.data || "剪贴板为空");
		},
		fail: (error) => record("getClipboardData", error.errMsg),
	});
}

function chooseImage() {
	uni.chooseImage({
		count: 1,
		sizeType: ["compressed"],
		sourceType: ["album", "camera"],
		success(result) {
			imagePath.value = result.tempFilePaths[0];
			record("chooseImage", imagePath.value);
		},
		fail: (error) => record("chooseImage", error.errMsg),
	});
}

function previewImage() {
	uni.previewImage({ current: imagePath.value, urls: [imagePath.value] });
}
</script>
