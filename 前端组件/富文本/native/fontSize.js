/**
 * 字体大小选择器模块
 */
class FontSizeSelector {
  constructor(editor) {
    this.editor = editor;
    this.initFontSizeSelect();
  }

  initFontSizeSelect() {
    const select = document.getElementById('fontSizeSelect');
    const trigger = select.querySelector('.select-trigger');
    const options = select.querySelector('.select-options');
    const optionItems = select.querySelectorAll('.select-option');
    const selectText = select.querySelector('.select-text');

     // 点击触发器显示/隐藏选项
     trigger.addEventListener('click', (e) => {
       e.stopPropagation();
      const isOpen = options.classList.contains('show');

      // 关闭其他打开的选择器
      document.querySelectorAll('.select-options.show').forEach(opt => {
        if (opt !== options) opt.classList.remove('show');
      });
      document.querySelectorAll('.color-options.show').forEach(opt => {
        opt.classList.remove('show');
      });

      if (isOpen) {
        options.classList.remove('show');
        trigger.classList.remove('active');
      } else {
        options.classList.add('show');
        trigger.classList.add('active');
      }
    });

    // 选择选项
    optionItems.forEach(option => {
       option.addEventListener('click', (e) => {
         e.stopPropagation();

         // 更新选中状态
         optionItems.forEach(opt => opt.classList.remove('selected'));
         option.classList.add('selected');

         // 执行命令
         this.editor.execCommand('fontSize', false, option.dataset.value);

         // 关闭选项
         options.classList.remove('show');
         trigger.classList.remove('active');
       });
     });

    // 点击其他地方关闭选择器
    document.addEventListener('click', () => {
      options.classList.remove('show');
      trigger.classList.remove('active');
    });
  }
}
