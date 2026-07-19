<template>
  <div>
    <el-input
      v-model="text"
      placeholder="v-model 测试"
      v-input="{ length: 10, max: 5000, min: 10 }"
      style="margin-bottom: 10px"
    />
    <el-input
      :value="text1"
      placeholder="value 测试"
      v-input="{ length: 10, max: 5000, min: 10 }"
      @input="value => (text1 = value)"
      style="margin-bottom: 10px"
    />
    <input
      v-input="{ minus: true }"
      v-model="text2"
      placeholder="v-model 测试"
      style="display: block; margin-bottom: 10px"
    />
    <input
      v-input="{ minus: true }"
      :value="text3"
      placeholder="value 测试"
      @input="(event) => (text3 = event.target.value)"
      style="display: block; margin-bottom: 10px"
    />
    <el-button type="primary" @click="onClick">获取最终值</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      text1: '',
      text2: '',
      text3: '',
    }
  },
  methods: {
    onClick() {
      console.log(1, this.text, 2, this.text1, 3, this.text2, 4, this.text3)
    },
  },
}
</script>

<style lang="scss" scoped>
</style>