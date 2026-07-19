[numeral](http://numeraljs.com/)
[掘金 el-input 支持千分位](https://juejin.cn/post/7042497719142711303)

```js
// 设置光标所在位置
setCursorPos() {
  const input = this.getInput();
  if (this.thousandFormatter && input) {
    let newPos = 0;
    if (input.selectionStart === 0 && input.selectionEnd === 0) {
    } else {
      // input组件输入完，光标所在的位置
      let cursorPos = input.selectionStart === input.selectionEnd ? input.selectionEnd : 0;
      // 如果存在负号，则光标--
      /^-/.test(input.value) && cursorPos--;
      // 数值的绝对值字符串
      let absolutePart = input.value.replace(/-/g, '');
      // 数值的整数部分（去除,）
      let intergerPart = absolutePart.replace(/,/g, '').split('.')[0];
      // 光标左侧部分（去除,）
      let leftPart = absolutePart.slice(0, cursorPos).replace(/,/g, '');
      // 整数部分长度
      let intergerPartLen = intergerPart.length;
      // 光标左侧部分长度
      let leftPartLen = leftPart.length;
      // 光标如果是在小数点后的话，什么都不干
      if (leftPartLen > intergerPartLen + 1) {
        newPos = cursorPos;
      } else {
        // 标记newPos：光标左侧部分 在 整数部分的 位置
        newPos = intergerPart.indexOf(leftPart) + leftPartLen;
        // 计算整数部分理论上应该有多少个逗号
        let allComasNum = intergerPartLen === 0 ? 0 : intergerPartLen % 3 === 0 ? Math.floor(intergerPartLen / 3) - 1 : Math.floor(intergerPartLen / 3);
        // 光标在整数部分的右侧 的长度
        let rightPartLen = intergerPartLen - leftPartLen;
        // 光标在整数部分的右侧 理论上有多少个逗号
        let rightComasNum = rightPartLen === 0 ? 0 : Math.floor(rightPartLen / 3);
        // 根据整数部分的逗号数，以及右侧部分的逗号数，算出光标应该要移动多少位
        let addComasLen = allComasNum - rightComasNum;
        newPos = newPos + addComasLen;
      }
      // 如果有负号，则newPos++
      /^-/.test(input.value) && newPos++;
    }
    this.$nextTick(() => {
      input.selectionStart = newPos;
      input.selectionEnd = newPos;
    });
  }
}
```