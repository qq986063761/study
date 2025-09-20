/**
 * Vue富文本编辑器主应用
 */
const { createApp } = Vue;

createApp({
  data() {
    return {
      // 颜色选项
      colors: [
        '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
        '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
        '#ff8000', '#8000ff', '#0080ff', '#ff0080'
      ],
      
      // 工具栏配置
      toolbarGroups: [
        {
          id: 'heading',
          type: 'select',
          label: '标题:',
          open: false,
          currentValue: '正文',
          options: [
            { value: 'p', text: '正文' },
            { value: 'h1', text: '标题1' },
            { value: 'h2', text: '标题2' },
            { value: 'h3', text: '标题3' },
            { value: 'h4', text: '标题4' },
            { value: 'h5', text: '标题5' },
            { value: 'h6', text: '标题6' }
          ]
        },
        {
          id: 'fontSize',
          type: 'select',
          label: '字体大小:',
          open: false,
          currentValue: '16px',
          options: [
            { value: '12px', text: '12px' },
            { value: '14px', text: '14px' },
            { value: '16px', text: '16px' },
            { value: '18px', text: '18px' },
            { value: '20px', text: '20px' },
            { value: '24px', text: '24px' },
            { value: '28px', text: '28px' },
            { value: '32px', text: '32px' }
          ]
        },
        {
          id: 'customFontSize',
          type: 'input',
          inputType: 'number',
          value: '',
          placeholder: '自定义大小',
          className: 'font-size-input',
          min: 8,
          max: 72,
          onEnter: () => this.applyCustomFontSize()
        },
        {
          id: 'foreColor',
          type: 'color',
          label: '前景色:',
          open: false,
          currentValue: '#000000'
        },
        {
          id: 'backColor',
          type: 'color',
          label: '背景色:',
          open: false,
          currentValue: '#ffffff'
        },
        {
          id: 'textFormat',
          type: 'buttons',
          buttons: [
            {
              id: 'bold',
              content: '<strong>B</strong>',
              title: '粗体',
              active: false,
              action: () => this.toggleBold()
            },
            {
              id: 'italic',
              content: '<em>I</em>',
              title: '斜体',
              active: false,
              action: () => this.toggleItalic()
            },
            {
              id: 'underline',
              content: '<u>U</u>',
              title: '下划线',
              active: false,
              action: () => this.toggleUnderline()
            },
            {
              id: 'strikethrough',
              content: '<s>S</s>',
              title: '中划线',
              active: false,
              action: () => this.toggleStrikethrough()
            }
          ]
        },
        {
          id: 'alignment',
          type: 'buttons',
          buttons: [
            {
              id: 'left',
              content: '⬅',
              title: '左对齐',
              active: true,
              action: () => this.setAlignment('left')
            },
            {
              id: 'center',
              content: '⬆',
              title: '居中',
              active: false,
              action: () => this.setAlignment('center')
            },
            {
              id: 'right',
              content: '➡',
              title: '右对齐',
              active: false,
              action: () => this.setAlignment('right')
            },
            {
              id: 'justify',
              content: '⬌',
              title: '两端对齐',
              active: false,
              action: () => this.setAlignment('justify')
            }
          ]
        },
        {
          id: 'list',
          type: 'buttons',
          buttons: [
            {
              id: 'unorderedList',
              content: '• 列表',
              title: '无序列表',
              active: false,
              action: () => this.toggleUnorderedList()
            },
            {
              id: 'orderedList',
              content: '1. 列表',
              title: '有序列表',
              active: false,
              action: () => this.toggleOrderedList()
            },
            {
              id: 'indent',
              content: '→ 缩进',
              title: '增加缩进',
              active: false,
              action: () => this.indent()
            },
            {
              id: 'outdent',
              content: '← 减少缩进',
              title: '减少缩进',
              active: false,
              action: () => this.outdent()
            }
          ]
        },
        {
          id: 'table',
          type: 'buttons',
          buttons: [
            {
              id: 'insertTable',
              content: '📊 表格',
              title: '插入表格',
              active: false,
              action: () => this.insertTable()
            }
          ]
        },
        {
          id: 'link',
          type: 'buttons',
          buttons: [
            {
              id: 'insertLink',
              content: '🔗 链接',
              title: '插入链接',
              active: false,
              action: () => this.insertLink()
            }
          ]
        },
        {
          id: 'fullscreen',
          type: 'buttons',
          buttons: [
            {
              id: 'toggleFullscreen',
              content: '全屏',
              title: '全屏',
              active: false,
              action: () => this.toggleFullscreen()
            }
          ]
        },
        {
          id: 'utils',
          type: 'buttons',
          buttons: [
            {
              id: 'clearFormat',
              content: '清除格式',
              title: '清除格式',
              active: false,
              action: () => this.clearFormat()
            },
            {
              id: 'getHtml',
              content: '获取HTML',
              title: '获取HTML',
              active: false,
              action: () => this.getHtml()
            }
          ]
        }
      ],
      
      // 全屏状态
      isFullscreen: false
    }
  },
  
  mounted() {
    // 初始化各个功能模块
    this.headingManager = new HeadingManager(this);
    this.fontSizeManager = new FontSizeManager(this);
    this.customFontSizeManager = new CustomFontSizeManager(this);
    this.foreColorManager = new ForeColorManager(this);
    this.backColorManager = new BackColorManager(this);
    this.textFormatManager = new TextFormatManager(this);
    this.alignmentManager = new AlignmentManager(this);
    this.listManager = new ListManager(this);
    this.tableManager = new TableManager(this);
    this.linkManager = new LinkManager(this);
    this.fullscreenManager = new FullscreenManager(this);
    this.utilsManager = new UtilsManager(this);
    
    // 初始化编辑器状态
    this.updateEditorState();
  },
  
  methods: {
    // 通用选择器切换
    toggleSelect(groupId) {
      const group = this.toolbarGroups.find(g => g.id === groupId);
      if (group) {
        group.open = !group.open;
        this.closeOtherSelectors(groupId);
      }

      console.log('toggleSelect', this.toolbarGroups);
    },
    
    // 通用选项选择
    selectOption(groupId, option) {
      const group = this.toolbarGroups.find(g => g.id === groupId);
      if (group) {
        group.currentValue = option.text;
        group.open = false;
        
        // 根据组ID执行相应操作
        if (groupId === 'heading') {
          this.headingManager.applyHeading(option.value);
        } else if (groupId === 'fontSize') {
          this.fontSizeManager.applyFontSize(option.value);
        }
      }
    },
    
    // 通用颜色选择器切换
    toggleColorPicker(groupId) {
      const group = this.toolbarGroups.find(g => g.id === groupId);
      if (group) {
        group.open = !group.open;
        this.closeOtherSelectors(groupId);
      }
    },
    
    // 通用颜色选择
    selectColor(groupId, color) {
      const group = this.toolbarGroups.find(g => g.id === groupId);
      if (group) {
        group.currentValue = color;
        group.open = false;
        
        // 根据组ID执行相应操作
        if (groupId === 'foreColor') {
          this.foreColorManager.applyForeColor(color);
        } else if (groupId === 'backColor') {
          this.backColorManager.applyBackColor(color);
        }
      }
    },
    
    // 自定义字体大小
    applyCustomFontSize() {
      const group = this.toolbarGroups.find(g => g.id === 'customFontSize');
      if (group && group.value) {
        this.customFontSizeManager.applyCustomFontSize(group.value + 'px');
      }
    },
    
    // 文本格式
    toggleBold() {
      this.textFormatManager.toggleBold();
    },
    
    toggleItalic() {
      this.textFormatManager.toggleItalic();
    },
    
    toggleUnderline() {
      this.textFormatManager.toggleUnderline();
    },
    
    toggleStrikethrough() {
      this.textFormatManager.toggleStrikethrough();
    },
    
    // 对齐方式
    setAlignment(alignment) {
      // 更新所有对齐按钮状态
      const alignmentGroup = this.toolbarGroups.find(g => g.id === 'alignment');
      if (alignmentGroup) {
        alignmentGroup.buttons.forEach(button => {
          button.active = button.id === alignment;
        });
      }
      this.alignmentManager.setAlignment(alignment);
    },
    
    // 列表
    toggleUnorderedList() {
      this.listManager.toggleUnorderedList();
    },
    
    toggleOrderedList() {
      this.listManager.toggleOrderedList();
    },
    
    indent() {
      this.listManager.indent();
    },
    
    outdent() {
      this.listManager.outdent();
    },
    
    // 表格
    insertTable() {
      this.tableManager.insertTable();
    },
    
    // 链接
    insertLink() {
      this.linkManager.insertLink();
    },
    
    // 全屏
    toggleFullscreen() {
      this.fullscreenManager.toggleFullscreen();
      // 更新全屏按钮文本
      const fullscreenGroup = this.toolbarGroups.find(g => g.id === 'fullscreen');
      if (fullscreenGroup) {
        const button = fullscreenGroup.buttons.find(b => b.id === 'toggleFullscreen');
        if (button) {
          button.content = this.isFullscreen ? '退出全屏' : '全屏';
        }
      }
    },
    
    // 工具
    clearFormat() {
      this.utilsManager.clearFormat();
    },
    
    getHtml() {
      this.utilsManager.getHtml();
    },
    
    // 更新编辑器状态
    updateEditorState() {
      // 更新文本格式按钮状态
      const textFormatGroup = this.toolbarGroups.find(g => g.id === 'textFormat');
      if (textFormatGroup) {
        textFormatGroup.buttons.forEach(button => {
          switch(button.id) {
            case 'bold':
              button.active = document.queryCommandState('bold');
              break;
            case 'italic':
              button.active = document.queryCommandState('italic');
              break;
            case 'underline':
              button.active = document.queryCommandState('underline');
              break;
            case 'strikethrough':
              button.active = document.queryCommandState('strikeThrough');
              break;
          }
        });
      }
      
      // 更新列表按钮状态
      const listGroup = this.toolbarGroups.find(g => g.id === 'list');
      if (listGroup) {
        listGroup.buttons.forEach(button => {
          switch(button.id) {
            case 'unorderedList':
              button.active = document.queryCommandState('insertUnorderedList');
              break;
            case 'orderedList':
              button.active = document.queryCommandState('insertOrderedList');
              break;
          }
        });
      }
    },
    
    // 关闭其他选择器
    closeOtherSelectors(current) {
      this.toolbarGroups.forEach(group => {
        if (group.id !== current && (group.type === 'select' || group.type === 'color')) {
          group.open = false;
        }
      });
    }
  }
}).mount('#app');
