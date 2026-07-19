<template>
  <div class="my-table">
    测试
    <img :src="require('./empty.png')">
  </div>
</template>

<script>
export default {
  name: 'MyTable',
}
</script>

<style src="./table.scss"></style>
<style lang="scss">
.my-table {
  @include ellipsis;
}
</style>