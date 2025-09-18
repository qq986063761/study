/**
 * 字体颜色选择器模块
 */
class FontColorSelector {
  constructor(editor) {
    this.editor = editor;
    this.initFontColorPicker();
  }

  initFontColorPicker() {
    const picker = document.getElementById('fontColorPicker');
    const trigger = picker.querySelector('.color-trigger');
    const options = picker.querySelector('.color-options');
    const colorItems = picker.querySelectorAll('.color-option');

    // 点击触发器显示/隐藏选项
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = options.classList.contains('show');

      // 关闭其他打开的选择器
      document.querySelectorAll('.select-options.show').forEach(opt => {
        opt.classList.remove('show');
      });
      document.querySelectorAll('.color-options.show').forEach(opt => {
        if (opt !== options) opt.classList.remove('show');
      });

      if (isOpen) {
        options.classList.remove('show');
      } else {
        options.classList.add('show');
      }
    });

     // 选择颜色
     colorItems.forEach(colorItem => {
       colorItem.addEventListener('click', (e) => {
         e.stopPropagation();

         // 更新选中状态
         colorItems.forEach(item => item.classList.remove('selected'));
         colorItem.classList.add('selected');

         // 更新触发器颜色
         trigger.style.backgroundColor = colorItem.dataset.color;

         // 执行命令
         this.editor.execCommand('foreColor', false, colorItem.dataset.color);

         // 关闭选项
         options.classList.remove('show');
       });
     });

    // 点击其他地方关闭选择器
    document.addEventListener('click', () => {
      options.classList.remove('show');
    });
  }
}
