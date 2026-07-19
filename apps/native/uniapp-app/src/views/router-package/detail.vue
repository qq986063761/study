<template>
	<view class="page-shell">
		<view class="page-header">
			<text class="page-kicker">SUBPACKAGE / DETAIL</text>
			<text class="page-title">分包详情</text>
			<text class="page-description">当前页面栈 {{ stackDepth }} 层</text>
		</view>

		<view class="result-panel">
			<view class="result-heading">
				<text class="section-title">onLoad 参数</text>
				<text class="status-badge status-badge--success">已解析</text>
			</view>
			<text class="code-block" selectable>{{ queryText }}</text>
		</view>

		<view class="action-column">
			<button class="action-button action-button--primary" @click="backOrHome()">返回上一页</button>
			<button class="action-button" @click="relaunch()">清空页面栈并回首页</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { backOrHome, relaunch } from "@/router/index.js";

const queryText = ref("{}");
const stackDepth = ref(1);

onLoad((query) => {
	queryText.value = JSON.stringify(query || {}, null, 2);
	stackDepth.value = getCurrentPages().length;
});
</script>
