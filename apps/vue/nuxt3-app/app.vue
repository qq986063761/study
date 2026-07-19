<template>
	<div class="app">
		<NuxtPage />
		<!-- <NuxtRouteAnnouncer />
		<NuxtWelcome />-->
	</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useErrStore } from '/store/base.js'
let errStore = useErrStore()

onMounted(() => {
	/**
	 * window.onerror 能捕获大部分的异常（同步、异步进行时的js异常），不能捕获语法错误
	 * @param {String} message 错误信息
	 * @param {String} source 出错文件
	 * @param {Number} lineno 行号
	 * @param {Number} colno 列号
	 * @param {Object} error Error对象（对象）它的 stack 字段就是堆栈错误日志
	 */
	window.onerror = function(message, source, lineno, colno, error) {
		console.log('onerror', { message, source, lineno, colno, error })
    errStore.add({ message, source, lineno, colno, error })
		return true // 返回 true 表示已经被接收，就不会被上抛给浏览器
	}

	/**
	 * window.addEventListener 监听 error 可以捕获到资源请求等异常
	 * @param {String} type 事件类型
	 * @param {function} fn 事件触发函数
	 * @param {boolean|object} useCapture|options 是否启动捕获
	 */
	window.addEventListener(
		'error',
		function(event) {
			console.log('addEventListener error', event)
			
			if (event.target.nodeName) {
				errStore.add({ 
					message: '资源加载错误',
					nodeName: event.target.nodeName, 
					src: event.target.src || event.target.href
				})
			}
		},
		true
	)

	// 捕获一些漏掉的 promise 异常，可通过 Promise.reject('promise error') 测试
	window.addEventListener('unhandledrejection', function(event) {
		event.preventDefault()
		console.log('unhandledrejection', event)
    
    errStore.add({
      message: event.reason.message,
      stack: event.reason.stack,
    })
		return true
	})

	// 崩溃日志处理
	window.addEventListener('load', function() {
		sessionStorage.setItem('good_exit', 'pending')
		// 一段时间汇报一下正常使用的时间日志
		// setInterval(function () {
		//   sessionStorage.setItem('time_before_crash', newDate().toString())
		// }, 1000)
	})

	// 正常退出
	window.addEventListener('beforeunload', function() {
		sessionStorage.setItem('good_exit', 'true')
	})

	// 如果正常进入异常崩溃退出，崩溃退出时缓存变量将不会被设置为 true
	if (
		sessionStorage.getItem('good_exit') &&
		sessionStorage.getItem('good_exit') !== 'true'
	) {
		alert('异常崩溃退出日期：' + sessionStorage.getItem('time_before_crash'))
	}
})
</script>

<style lang="scss">
@use "~/assets/css/base.scss";

.app {
	height: 100%;
}
</style>
