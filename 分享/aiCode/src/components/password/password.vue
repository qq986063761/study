<template>
  <div class="password-container">
    <h2 class="title">安全验证</h2>
    <div class="subtitle">请输入交易密码</div>
    
    <div class="password-input">
      <input 
        v-for="(digit, index) in 6" 
        :key="index"
        type="text"
        maxlength="1"
        v-model="password[index]"
        @input="handleInput($event, index)"
        @keydown.delete="handleDelete($event, index)"
        @focus="handleFocus($event)"
        ref="inputs"
      >
    </div>

    <div class="forgot-password">
      <a href="javascript:void(0)" @click="handleForgotPassword">忘记密码?</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordInput',
  data() {
    return {
      password: new Array(6).fill('')
    }
  },
  methods: {
    handleInput(event, index) {
      const value = event.target.value
      // 只允许输入数字
      if (!/^\d*$/.test(value)) {
        this.password[index] = ''
        return
      }
      
      // 自动跳转到下一个输入框
      if (value && index < 5) {
        this.$refs.inputs[index + 1].focus()
      }
    },
    handleDelete(event, index) {
      // 处理删除键
      if (index > 0 && !this.password[index]) {
        this.$refs.inputs[index - 1].focus()
      }
    },
    handleFocus(event) {
      // 选中输入框内容
      event.target.select()
    },
    handleForgotPassword() {
      this.$emit('forgot-password')
    }
  },
  watch: {
    password: {
      handler(newValue) {
        // 当所有数字都输入完成时触发事件
        if (newValue.every(v => v !== '')) {
          this.$emit('complete', newValue.join(''))
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.password-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.password-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.password-input input {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 18px;
  outline: none;
}

.password-input input:focus {
  border-color: #007aff;
}

.forgot-password {
  font-size: 14px;
}

.forgot-password a {
  color: #666;
  text-decoration: none;
}

.forgot-password a:hover {
  color: #007aff;
}
</style>
