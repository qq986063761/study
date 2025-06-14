<template>
  <div class="password-demo-container">
    <password-form 
      ref="passwordForm"
      @submit="handleSubmit"
      @reset="handleReset"
    ></password-form>
  </div>
</template>

<script>
import PasswordForm from '@/components/password/password.vue'

export default {
  components: {
    PasswordForm
  },
  methods: {
    handleSubmit(valid, formData) {
      if (valid) {
        console.log('表单验证通过', formData);
        // 这里添加实际提交逻辑
      } else {
        console.log('表单验证失败');
      }
    },
    handleReset() {
      this.$refs.passwordForm.resetForm();
    }
  }
};
</script>

<style scoped>
.password-demo-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
