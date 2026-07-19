<template>
  <div>
    <p>下面是数据双向绑定的demo</p>
    <p>
      text: 
      <input type="text" v-model="text">
    </p>
    <p>
      text1: 
      <input type="text" v-model="_text1">
    </p>
  </div>
</template>

<script>
  export default {
    props: {
      // 接收 v-model 的值
      value: String,
      text1: String
    },
    computed: {
      text: {
        get() {
          return this.value
        },
        set(val) {
          // 传递值给父组件 v-model 绑定的变量，就实现了双向绑定
          this.$emit('input', val)
        }
      },
      _text1: {
        get() {
          return this.text1
        },
        set(val) {
          // 传递值给父组件 :text1.sync="text1" 绑定的变量，也能实现双向绑定
          this.$emit('update:text1', val)
        }
      },
    }
  }
</script>

<style>

</style>