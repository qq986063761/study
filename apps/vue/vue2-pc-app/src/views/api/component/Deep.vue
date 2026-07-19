<template>
  <ul>
    <li v-for="item in data" :key="item.label">
      <div style="cursor: pointer;" @click="onClick">
        递归组件，点击我可以获取到祖先组件的注入数据：{{item.label}}
      </div>
      <deep :data="item.children"></deep>
    </li>
  </ul>
</template>

<script>
export default {
  // 递归组件必须定义 name，这样自己才能被递归下去
  name: 'deep',
  // 利用注入，深层组件可以直接跨父组件直接取到祖先组件的数据
  inject: ['deepRoot'],
  props: {
    data: Array
  },
  methods: {
    onClick() {
      console.log('获取到祖先组件提供的数据', this.deepRoot)
    }
  }
}
</script>

<style>

</style>