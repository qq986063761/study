<template>
  <div class="password-container">
    <div class="title">安全验证</div>
    <div class="subtitle">请输入交易密码</div>
    <div class="inputs">
      <input
        v-for="(num, idx) in 6"
        :key="idx"
        type="password"
        maxlength="1"
        ref="inputs"
        v-model="password[idx]"
        @input="onInput(idx)"
        @keydown.backspace="onBackspace(idx, $event)"
        @focus="onFocus(idx)"
        autocomplete="off"
      />
    </div>
    <div class="forgot" @click="onForgot">忘记密码?</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: ['', '', '', '', '', ''],
    };
  },
  methods: {
    onInput(idx) {
      // 只允许输入数字
      this.password[idx] = this.password[idx].replace(/\D/g, '');
      if (this.password[idx] && idx < 5) {
        this.$refs.inputs[idx + 1].focus();
      }
      // 输入完成
      if (this.password.join('').length === 6) {
        this.$emit('complete', this.password.join(''));
      }
    },
    onBackspace(idx, e) {
      if (!this.password[idx] && idx > 0) {
        this.$refs.inputs[idx - 1].focus();
      }
    },
    onFocus(idx) {
      // 聚焦时自动选中内容
      this.$refs.inputs[idx].select();
    },
    onForgot() {
      this.$emit('forgot');
    },
  },
};
</script>

<style scoped>
.password-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
}
.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}
.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}
.inputs {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}
.inputs input {
  width: 48px;
  height: 48px;
  text-align: center;
  font-size: 24px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border 0.2s;
}
.inputs input:focus {
  border: 2px solid #409eff;
}
.forgot {
  color: #888;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;
}
.forgot:hover {
  color: #409eff;
}
</style>
