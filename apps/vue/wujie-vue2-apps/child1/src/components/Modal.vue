<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <div v-html="content"></div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">{{ cancelText }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ confirmText }}</el-button>
    </span>
  </el-dialog>
  
</template>

<script>
export default {
  name: 'Modal',
  data() {
    return {
      visible: false,
      dialogTitle: '提示',
      content: '',
      width: '480px',
      confirmText: '确 定',
      cancelText: '取 消'
    }
  },
  methods: {
    // options: { title, content (string), width, confirmText, cancelText, onConfirm, onCancel }
    show(options = {}) {
      const {
        title,
        content,
        width,
        confirmText,
        cancelText,
        onConfirm,
        onCancel
      } = options

      this.dialogTitle = title || '提示'
      this.width = width || '480px'
      this.confirmText = confirmText || '确 定'
      this.cancelText = cancelText || '取 消'
      this.onConfirm = typeof onConfirm === 'function' ? onConfirm : null
      this.onCancel = typeof onCancel === 'function' ? onCancel : null
      this.content = content || ''

      this.visible = true

      console.log('child1 modal show', {
        isEqMainWindow: window === window.parent,
        window
      })
    },
    handleConfirm() {
      if (this.onConfirm) {
        // 测试跨应用调用组件时，回调函数是否能正常传递不同类型的数据
        try { this.onConfirm({ num: 1, date: new Date(), cb: () => {} }) } catch (e) { /* noop */ }
      }
      this.visible = false
    },
    handleCancel() {
      if (this.onCancel) {
        try { this.onCancel() } catch (e) { /* noop */ }
      }
      this.visible = false
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>


