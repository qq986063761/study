<template>
	<el-menu class="menus" :default-active="data[0].value">
		<el-menu-item :index="item.value" v-for="item in data" :key="item.value">
			<el-icon>
				<Setting />
			</el-icon>
			<span>{{ item.label }}</span>
		</el-menu-item>
	</el-menu>
</template>

<script setup>
let { data } = defineProps(['data'])
</script>

<style lang="scss">
.menus {
}
</style>