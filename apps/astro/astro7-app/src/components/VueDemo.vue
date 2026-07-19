<template>
  <div class="demo-page">
    <h1>Vue 3 + Element Plus Demo</h1>
    <p>这个页面演示了在 Astro 里使用 Vue 3 组件和 Element Plus。</p>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>用户信息</span>
          <el-button type="primary" @click="addUser">新增</el-button>
        </div>
      </template>

      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="form.age" :min="1" :max="120" />
        </el-form-item>
        <el-form-item label="城市">
          <el-select v-model="form.city" placeholder="请选择城市">
            <el-option label="北京" value="北京" />
            <el-option label="上海" value="上海" />
            <el-option label="广州" value="广州" />
          </el-select>
        </el-form-item>
      </el-form>

      <el-table :data="users" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="age" label="年龄" width="120" />
        <el-table-column prop="city" label="城市" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const form = reactive({
  name: 'Alice',
  age: 24,
  city: '北京',
});

const users = reactive([
  { name: 'Alice', age: 24, city: '北京' },
  { name: 'Bob', age: 28, city: '上海' },
]);

function addUser() {
  users.push({
    name: form.name,
    age: form.age,
    city: form.city,
  });
}
</script>

<style scoped lang="scss">
.demo-page {
  max-width: 860px;
  margin: 2rem auto;
  padding: 2rem;
}

.box-card {
  margin-top: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
