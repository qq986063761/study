<template>
  <div class="comment-input">
    <div ref="content" class="comment-input-content">
      <div class="edit placeholder" v-show="!content">请输入...</div>
      <div 
        ref="input"
        class="edit" 
        contenteditable
        @keyup="onKeyUp"
        @input="onInput"
        @paste.prevent="onPaste"
        @keydown.ctrl.enter="onSubmit">
      </div>
      <div 
        ref="atPop"
        class="el-dropdown-menu" 
        :style="style"
        v-show="style">
        <div
          class="el-dropdown-menu__item"
          :key="item"
          v-for="item in atUsrs"
          @click="onClickAtItem({ key: item })"
        >
          {{item}}
        </div>
      </div>
    </div>
    <div class="comment-input-toolbar">
      <el-button type="text" @click="showAtPop">@</el-button>
      <el-button class="btn-submit" type="text" @click="onSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
  import {setSelection} from '@/assets/dom'
  
  export default {
    name: 'commentInput',
    data() {
      return {
        content: '',
        style: null,
        atUsrs: ['用户1', '用户2', '用户3']
      }
    },
    methods: {
      onClickOut(event) {
        if (this.$refs.atPop.contains(event.target) || this.showing) {
          this.showing = false
          return
        }

        this.style = null
      },
      onKeyUp(event) {
        // 避免键盘按的很快导致两次 keyup 让 Shift 和 2 键分开触发
        if (event.code === 'ShiftLeft') {
          this.shift = true
          setTimeout(() => this.shift = false, 100)
          return
        }

        // 输入 @ （按下 2 和 shift 就是 @） 开始选人
        if (event.code === 'Digit2' && 
          (event.shiftKey || this.shift)) {
          this.showAtPop()
        }
      },
      onInput(event) {
        this.content = event.target.innerHTML
      },
      // 拦截复制内容
      onPaste(event) {
        let text = (event.clipboardData || window.clipboardData).getData('text')
        document.execCommand('insertHTML', false, text)
      },
      onSubmit() {
        const {input} = this.$refs
        let text = input.innerHTML
        // 收集 @ 项，顺便处理 at 文本内容
        const atEls = [...input.querySelectorAll('.at')]
        const usrs = atEls.map(el => {
          // 去掉@的内容
          text = text.replace(new RegExp(el.outerHTML + '(&nbsp;)?'), '')
          return {name: el.getAttribute('data-name')}
        })

        if (!text) {
          this.$message.warning('请输入内容')
          return
        }

        this.init()
        this.$emit('submit', {
          content: text,
          usrs
        })
      },
      showAtPop(event) {
        // 点击 @ 定位弹窗
        if (event) {
          this.selection = null
          this.range = null
          this.showing = true
          this.style = {
            left: 0,
            top: `${this.$refs.content.offsetHeight}px`,
            display: 'block'
          }
          return
        }

        // 输入 @ 定位弹窗
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        const boxRect = this.$refs.content.getBoundingClientRect()

        this.selection = selection
        this.range = range
        this.style = {
          left: `${rect.left - boxRect.left - 28}px`,
          top: `${rect.top - boxRect.top + 14}px`,
          display: 'block' 
        }
      },
      // 选择了@选项
      onClickAtItem({key}) {
        let selection = this.selection
        let range = this.range
        let { input } = this.$refs
        let data = [key]
        this.style = null

        if (range) {
          // 删除 @
          range.setStart(range.startContainer, range.startOffset - 1)
          range.setEnd(range.startContainer, range.startOffset + 1)
          range.deleteContents()
          
          data.map(item => {
            const node = document.createElement('span')
            node.className = 'at'
            node.dataset.userid = item
            node.dataset.name = item
            node.contentEditable = false
            node.onclick = () => false
            node.innerText = `@${item}`
            range.insertNode(node)
            // 光标设置到指定元素后
            range.setStartAfter(node)
            range.setEndAfter(node)

            const text = document.createTextNode('\u00A0')
            range.insertNode(text)
            range.setStartAfter(text)
            range.setEndAfter(text)
          })

          selection.removeAllRanges()
          selection.addRange(range)
        } else {
          let html = ''
          data.map(item => {
            html += `<span class="at" data-name="${item}" data-userid="${item}" onclick="return false;">@${item}</span>&nbsp;`
          })

          input.innerHTML += html
          
          selection = window.getSelection()
          range = document.createRange()
          range.selectNodeContents(input)
          range.collapse(false)

          selection.removeAllRanges()
          selection.addRange(range)
        }

        this.content = input.innerHTML
      },
      init() {
        const {input} = this.$refs
        this.content = input.innerHTML = ''
      }
    },
    mounted() {
      document.body.addEventListener('click', this.onClickOut)
    },
    beforeDestroy() {
      document.body.removeEventListener('click', this.onClickOut)
    }
  }
</script>

<style lang="scss">
  .comment-input {
    position: relative;
  }

  .comment-input-content {
    position: relative;
    border: 1px solid lightgray;
    border-radius: 4px;
    
    .edit {
      min-height: 60px;
      padding: 5px 10px;
      background: #fff;
      line-height: 20px;
      .at {
        color: blue;
      }
    }

    .placeholder {
      position: absolute;
      background: transparent;
      color: #c5c5c5;
      pointer-events: none;
    }

    .el-dropdown-menu {
      position: absolute;
      z-index: 1;
    }
  }

  .comment-input-toolbar {
    position: relative;
    display: flex;
    justify-content: space-between;
  }
</style>