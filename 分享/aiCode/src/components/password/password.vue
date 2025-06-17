<template>
  <div class="password-container">
    <div class="title">安全验证</div>
    <div class="subtitle">请输入交易密码</div>
    <div class="inputs">
      <input
        v-for="(num, idx) in passwordArr"
        :key="idx"
        ref="inputs"
        type="password"
        maxlength="1"
        inputmode="numeric"
        pattern="[0-9]*"
        v-model="passwordArr[idx]"
        @input="onInput(idx, $event)"
        @keydown.backspace="onBackspace(idx, $event)"
        @focus="onFocus(idx)"
        :class="{ active: currentIdx === idx }"
      />
    </div>
    <div class="forgot" @click="onForgot">忘记密码?</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      passwordArr: ['', '', '', '', '', ''],
      currentIdx: 0,
    };
  },
  methods: {
    onInput(idx, e) {
      const val = e.target.value.replace(/\D/g, '');
      this.$set(this.passwordArr, idx, val);
      if (val && idx < 5) {
        this.focusInput(idx + 1);
      }
      if (this.passwordArr.join('').length === 6) {
        this.$emit('complete', this.passwordArr.join(''));
      }
    },
    onBackspace(idx, e) {
      if (!this.passwordArr[idx] && idx > 0) {
        this.focusInput(idx - 1);
      }
    },
    onFocus(idx) {
      this.currentIdx = idx;
    },
    focusInput(idx) {
      this.$refs.inputs[idx].focus();
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
  font-size: 18px;
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
  background: #fff;
}
.inputs input.active,
.inputs input:focus {
  border: 2px solid #409eff;
}
.forgot {
  color: #888;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;
  user-select: none;
}
.forgot:hover {
  color: #409eff;
}
</style>
