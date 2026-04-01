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
  // 从 canvas 中获取图片数据
  let imgData = canvas.toDataURL('image/jpeg', 0.5)

  // 创建 jsPDF 实例
  let pdf = new jsPDF('p', 'mm', 'a4', {
    compress: true // 启用压缩
  })

  // 计算图像在 PDF 中的宽高，保持原始比例
  let imgWidth = 210; // A4 纸的宽度是 210mm
  let pageHeight = 297; // A4 纸的高度是 297mm
  let imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  // 如果图像高度大于一页的高度，则需要分多页添加
  if (heightLeft > pageHeight) {
    while (heightLeft > 0) {
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      position -= pageHeight;

      // 如果还有剩余内容，添加新的一页
      if (heightLeft > 0) {
        pdf.addPage();
      }
    }
  } else {
    // 图像高度小于一页高度，直接添加
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
  }

  // 导出 PDF
  pdf.save(name + '.pdf')
})
```