<template>
  <div class="api-animate-demo">
    <p>
			<el-button 
        style="margin-right: 20px;"
        @click="show = !show">
        点击过渡
      </el-button>
			<!--
				mode：过渡模式 
			-->
			<transition name="fade" mode="out-in">
				<!-- 多个元素过渡时最好用 key 做唯一区分，否则会因为 vue 缓存机制导致没有效果 -->
				<span v-if="show" key="true">显示</span>
				<span v-else key="false">隐藏</span>
			</transition>
		</p>
    
    <transition
      name="fade"
      appear
    >
      <p>我只初始化过渡一次</p>
    </transition>

    <p>
			<el-button 
        type="primary"
        @click="show1 = !show1">
        js 钩子过渡
      </el-button>
			<transition
				@before-enter="onBeforeEnter"
				@enter="onEnter"
				@after-enter="onAfterEnter"
				@enter-cancelled="onEnterCancelled"
				@before-leave="onBeforeLeave"
				@leave="onLeave"
				@after-leave="onAfterLeave"
				@leave-cancelled="onLeaveCancelled">
				<ul class="collapse" v-show="show1">
					<li v-for="num in 10" :key="num">item {{num}}</li>
				</ul>
			</transition>
		</p>

    <p>
			列表过渡：
			<el-button @click="add">添加</el-button>
			<el-button @click="remove">减少</el-button>
			<el-button @click="shuffle">洗牌</el-button>
			<transition-group 
				class="items" 
				name="list"
				tag="div">
				<!-- key 是必须要保持唯一的，否则过渡动画出现的位置就会有问题 -->
				<div v-for="item in items" :key="item" class="item">
					{{ item }}
				</div>
			</transition-group>
		</p>
  </div>
</template>

<script>
import shuffle from 'lodash/shuffle'

export default {
  data() {
    return {
      show: false,
      show1: false,
      items: [1, 2, 3, 4, 5, 6],
      nextNum: 7
    }
  },
  methods: {
    onBeforeEnter(el) {
      el.style.maxHeight = 0
      console.log('before-enter', el.offsetHeight)
    },
    onEnter(el, done) {
      console.log('enter', el.offsetHeight, el.scrollHeight)
      el.style.maxHeight = el.scrollHeight + 'px'
      done()
    },
    onAfterEnter(el) {
      console.log('after-enter', el.offsetHeight)
    },
    onEnterCancelled(el) {
      console.log('enter-cancelled', el.offsetHeight)
    },
    onBeforeLeave(el) {
      console.log('before-leave', el.offsetHeight)
    },
    onLeave(el, done) {
      el.style.maxHeight = 0
      console.log('leave', el.offsetHeight)
      setTimeout(() => {
        done()
      }, 400);
    },
    onAfterLeave(el) {
      console.log('after-leave', el.offsetHeight)
    },
    onLeaveCancelled(el) {
      console.log('leave-cancelled', el.offsetHeight)
    },
    randomIndex() {
      return Math.floor(Math.random() * this.items.length)
    },
    add() {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove() {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle() {
      this.items = shuffle(this.items)
    }
  }
}
</script>

<style lang="scss">
  /* 开始和结束的中间状态，可在此时设置动画，则会以动画时间区间为两端 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .3s ease;
  }

  /* 开始和结束的终端状态 */
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .list-enter-active, 
  .list-leave-active {
    transition: all 1s;
  }
  .list-leave-active {
    position: absolute;
  }
  .list-enter, 
  .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .api-animate-demo {
    .collapse {
      overflow: hidden;
      transition: max-height .2s ease-in-out;
    }

    .items {
			display: flex;
			width: 300px;
    	flex-wrap: wrap;
		}
		.item {
			margin-right: 10px;
			transition: all 1s;
		}
  }
</style>