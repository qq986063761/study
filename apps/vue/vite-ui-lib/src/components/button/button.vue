<template>
  <button class="my-button" @click="onClick">
    <slot>{{ text }}</slot>
  </button>
</template>

<script>
export default {
  name: 'MyButton',
  props: {
    text: String
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  },
  mounted() {
    // 测试 eslint 规则
    // const a = '1'
    // const b = "2"
    // console.log(a + b)
    // console.log("button mounted")
  }
}
</script>

<style lang="scss">
.my-button {
  display: inline-flex;
  height: 32px;
  padding: 8px 15px;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  text-align: center;
  background: #fff;
  border: 1px solid $border-color;
  border-radius: 4px;
  transition: all 0.3s ease;
  user-select: none;
}
</style>