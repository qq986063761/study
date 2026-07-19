<template>
	<div
		class="scroll-active-item-demo"
		ref="scroller"
		v-scroll-active-item="{
			scroller: scroller, // items 所在滚动容器
			items: items, // 列表组件或元素数组
			onScroll: onScroll, // 监听滚动
			currentIndex: currentIndex, // 当前激活的 index
		}"
	>
		<div
			ref="items"
			class="item"
			:class="{ active: i === currentIndex }"
			v-for="(item, i) in 10"
			:key="i"
		></div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			scroller: null,
			items: null,
			currentIndex: 0,
		}
	},
	methods: {
		onScroll(event, { index }) {
			console.log(event, { index })
			this.currentIndex = index
		},
	},
	mounted() {
		this.scroller = this.$refs.scroller
		this.items = this.$refs.items
	},
}
</script>

<style lang="scss">
.scroll-active-item-demo {
	height: 100%;
	overflow: auto;
	.item {
		height: 300px;
		background: #fff;
		border: 1px solid #999;
		+ .item {
			margin-top: 10px;
		}
		&.active {
			border: 2px solid blue;
		}
	}
}
</style>