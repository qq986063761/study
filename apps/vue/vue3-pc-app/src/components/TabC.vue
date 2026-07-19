<template>
  <div class="tab-content-item">
    <h4>标签页 C</h4>
    <p>这是标签页 C 的内容</p>
    <select>
      <option>选项 1</option>
      <option>选项 2</option>
      <option>选项 3</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'TabC'
}
</script>

<style lang="scss" scoped>
.tab-content-item {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;

  h4 {
    margin-top: 0;
    color: #333;
  }

  p {
    color: #666;
    margin-bottom: 15px;
  }

  select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    background-color: white;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
  }
}
</style>
