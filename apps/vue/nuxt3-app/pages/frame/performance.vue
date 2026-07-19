<template>
	<div class="frame-perormance">
		<div class="box">
			<div>
				<h1>性能日志</h1>
				<div v-for="({ label, text }) in timings" :key="label">{{ label }}: {{ text }}</div>
			</div>

			<div>
				<h1>错误日志</h1>
				<div v-for="(data, i) in errList" :key="i">
					<b>序号：{{i}}</b>
					<template v-for="(val, key) in data">
						<div
							v-if="key === 'error' || key === 'stack'"
							:key="key + 'error'"
							v-html="`stack: ${ (val.stack || val).replace(/\n/g, '<br>') }`"
						></div>
						<div :key="key" v-else>{{ key }}: {{ val }}</div>
					</template>
				</div>
			</div>
		</div>

		<el-button type="primary" @click="onError('onerr')">触发 window.onerror 错误</el-button>
		<el-button type="success" @click ="onError('errevent')">触发 addEventListener error 错误</el-button>
		<el-button type="danger" @click="onError('promiseErr')">触发 addEventListener unhandledrejection 错误</el-button>
	</div>
</template>

<script setup>
// 定义页面 key，用于其他页面路由匹配
definePageMeta({
	key: route => route.frame
})

import { ref, onMounted } from 'vue'
import { useErrStore } from '/store/base.js'
let { errList } = useErrStore()

let timings = ref([])
// console.log('performance', performance)

let errTestData = null
let onError = type => {
	switch (type) {
    case 'promiseErr':
      Promise.reject(new Error("This is an unhandled rejection!"))
      break
		case 'onerr':
			errTestData.name = 1
			break
    case 'errevent':
      let img = document.createElement('img')
      img.src = 'non-existent-image.png'
      document.body.appendChild(img)
      let js = document.createElement('script')
      js.src = 'non-existent-script.js'
      document.body.appendChild(js)
      let css = document.createElement('link')
      css.href = 'non-existent-style.css'
      css.rel = 'stylesheet'
      document.body.appendChild(css)
      break
	}
}

onMounted(() => {
	let { timing } = performance
	let timingLabelMap = {
		domContentLoadedEventStart: '文档内容加载开始',
		domContentLoadedEventEnd: '文档内容加载结束',
		domComplete: '文档内容完全加载完成',
		loadEventStart: '页面完全加载的开始',
		loadEventEnd: '页面完全加载的结束'
	}

	for (let prop in timing) {
		let val = timing[prop]
		if (typeof val !== 'number') continue

		let date = new Date(val)

		timings.value.push({
			prop,
			value: val,
			label: timingLabelMap[prop] || prop,
			text: date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
		})
	}

	timings.value = timings.value.sort((a, b) => a.value - b.value)
})
</script>

<style lang="scss">
.frame-perormance {
	.box {
		display: flex;
		word-break: break-all;

		> div {
			flex: 1;
			overflow: hidden;
		}
	}
}
</style>