<template>
	<view class="page-shell">
		<view class="page-header">
			<text class="page-kicker">ROUTER / INDEX</text>
			<text class="page-title">路由导航</text>
			<text class="page-description">当前页面栈 {{ stackDepth }} 层</text>
		</view>

		<view class="form-panel">
			<text class="field-label">业务来源</text>
			<input v-model="source" class="text-input" maxlength="24" placeholder="例如 dashboard" />
			<text class="field-label">跟踪 ID</text>
			<input v-model="traceId" class="text-input" maxlength="24" placeholder="自动生成" />
			<button class="action-button action-button--primary" @click="openDetail">进入分包详情</button>
		</view>

		<view class="result-panel">
			<view class="result-heading">
				<text class="section-title">路由表</text>
				<text class="status-badge status-badge--neutral">常量引用</text>
			</view>
			<text class="code-block" selectable>{{ routeSummary }}</text>
		</view>

		<button class="text-button" @click="backOrHome()">返回</button>
	</view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { backOrHome, navigateTo, routes } from "@/router/index.js";

const source = ref("dashboard");
const traceId = ref(`T${Date.now().toString().slice(-8)}`);
const stackDepth = ref(1);

const routeSummary = computed(() => Object.entries(routes).map(([name, path]) => `${name}: ${path}`).join("\n"));

onShow(() => {
	stackDepth.value = getCurrentPages().length;
});

function openDetail() {
	navigateTo(routes.routerDetail, {
		source: source.value,
		traceId: traceId.value,
	});
}
</script>
