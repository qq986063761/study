<template>
	<view class="page-shell">
		<view class="page-header">
			<text class="page-kicker">UNI-APP ENTERPRISE DEMO</text>
			<text class="page-title">移动业务工作台</text>
			<text class="page-description">{{ greeting }}，当前计数 {{ count }}，派生值 {{ doubleCount }}</text>
		</view>

		<view class="metric-strip">
			<view class="metric-item">
				<text class="metric-value">4</text>
				<text class="metric-label">架构模块</text>
			</view>
			<view class="metric-item">
				<text class="metric-value">6+</text>
				<text class="metric-label">原生 API</text>
			</view>
			<view class="metric-item">
				<text class="metric-value">1</text>
				<text class="metric-label">路由分包</text>
			</view>
		</view>

		<view class="section-heading">
			<text class="section-title">工程模块</text>
			<text class="section-meta">src 分层示例</text>
		</view>

		<view class="menu-list">
			<view
				v-for="item in menuItems"
				:key="item.path"
				class="menu-row"
				hover-class="menu-row--active"
				@click="openPage(item.path)"
			>
				<view class="menu-copy">
					<text class="menu-title">{{ item.title }}</text>
					<text class="menu-description">{{ item.description }}</text>
				</view>
				<text class="menu-arrow">›</text>
			</view>
		</view>

		<view class="section-heading">
			<text class="section-title">快捷状态</text>
			<text class="section-meta">Pinia</text>
		</view>
		<view class="action-row">
			<button class="action-button action-button--primary" @click="store.increment()">计数 +1</button>
			<button class="action-button" @click="store.resetCount()">重置</button>
		</view>
	</view>
</template>

<script setup>
import { onShow } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { navigateTo, routes } from "@/router/index.js";
import { useAppStore } from "@/store/modules/app.js";

const store = useAppStore();
const { count, doubleCount, greeting } = storeToRefs(store);

const menuItems = [
	{ title: "业务 API", description: "统一请求层与模块化接口", path: routes.api },
	{ title: "全局状态", description: "Pinia 状态、派生值与本地持久化", path: routes.store },
	{ title: "路由导航", description: "路径常量、查询参数与分包页面", path: routes.router },
	{ title: "uni 原生 API", description: "设备、交互、存储、剪贴板与媒体", path: routes.nativeApi },
];

onShow(() => {
	store.initialize();
});

function openPage(path) {
	navigateTo(path);
}
</script>
