- [FileSaver](https://www.npmjs.com/package/file-saver)
- [jspdf](https://github.com/parallax/jsPDF)
- [html2pdf](https://ekoopmans.github.io/html2pdf.js/)
- [jspdf-table]()

```js
html2canvas(el, {
  scale: window.devicePixelRatio,  // 根据设备的像素比例缩放
  useCORS: true,                   // 处理跨域图片
  logging: true,                   // 启用日志记录以调试
  width: el.offsetWidth,  // 设置宽度为可滚动宽度
  height: el.offsetHeight // 设置高度为可滚动高度
}).then(canvas => {

})

html2pdf(el, {
  filename: name + '.pdf',
  margin: 5,
  html2canvas: {
    canvas, // 你已经生成的canvas
    scale: 1, // 控制缩放比例
    width: canvas.offsetWidth, // 使用元素的宽度
    height: canvas.offsetHeight, // 使用元素的高度
    useCORS: true, // 允许跨域加载图片
    logging: true
  },
  jsPDF: {
    unit: 'px', // 单位设置为像素以更好地控制尺寸
    format: [canvas.offsetWidth, canvas.offsetHeight] // 设置与元素尺寸匹配的PDF页面大小
  }
}).then(() => {
  exportFinish()
})
```