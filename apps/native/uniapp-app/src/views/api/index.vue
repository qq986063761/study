<template>
	<view class="page-shell">
		<view class="page-header">
			<text class="page-kicker">API / MODULES / TODO</text>
			<text class="page-title">业务接口层</text>
			<text class="page-description">GET /todos/:id</text>
		</view>

		<view class="form-panel">
			<text class="field-label">资源 ID</text>
			<input v-model="todoId" class="text-input" type="number" placeholder="输入 1 - 200" />
			<button class="action-button action-button--primary" :loading="loading" :disabled="loading" @click="loadTodo">
				{{ loading ? "请求中" : "发送请求" }}
			</button>
		</view>

		<view class="result-panel">
			<view class="result-heading">
				<text class="section-title">响应结果</text>
				<text :class="['status-badge', `status-badge--${statusTone}`]">{{ statusText }}</text>
			</view>
			<text class="code-block" selectable>{{ resultText }}</text>
		</view>

		<button class="text-button" @click="backOrHome()">返回</button>
	</view>
</template>

<script setup>
import { computed, ref } from "vue";
import { getTodo } from "@/api/modules/todo.js";
import { backOrHome } from "@/router/index.js";

const todoId = ref("1");
const loading = ref(false);
const status = ref("idle");
const result = ref(null);

const statusText = computed(() => ({ idle: "等待请求", success: "请求成功", error: "请求失败" })[status.value]);
const statusTone = computed(() => ({ idle: "neutral", success: "success", error: "error" })[status.value]);
const resultText = computed(() => {
	if (status.value === "idle") return "尚无响应";
	if (status.value === "error") return result.value;
	return JSON.stringify(result.value, null, 2);
});

async function loadTodo() {
	const id = Number.parseInt(todoId.value, 10);
	if (!Number.isInteger(id) || id < 1 || id > 200) {
		uni.showToast({ title: "请输入 1 - 200", icon: "none" });
		return;
	}

	loading.value = true;
	status.value = "idle";
	try {
		result.value = await getTodo(id);
		status.value = "success";
	} catch (error) {
		result.value = error.message;
		status.value = "error";
	} finally {
		loading.value = false;
	}
}
</script>
