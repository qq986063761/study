/**
 * Vue富文本编辑器主应用
 */
const { createApp } = Vue;

createApp({
  data() {
    return {
      // 选区缓存
      cachedRange: null,
      
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
    
    // 添加选区缓存监听
    this.initRangeCache();
  },
  
  methods: {
    // 通用选择器切换
    toggleSelect(groupId) {
      const group = this.toolbarGroups.find(g => g.id === groupId);
      if (group) {
        group.open = !group.open;
        this.closeOtherSelectors(groupId);
      }
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
              button.active = this.isFormatActive('strong');
              break;
            case 'italic':
              button.active = this.isFormatActive('em');
              break;
            case 'underline':
              button.active = this.isFormatActive('u');
              break;
            case 'strikethrough':
              button.active = this.isFormatActive('s');
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
              button.active = this.isInList('ul');
              break;
            case 'orderedList':
              button.active = this.isInList('ol');
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
    },
    
    // 初始化选区缓存
    initRangeCache() {
      const editor = this.$refs.editor;
      if (!editor) return;
      
      // 监听鼠标和触摸事件来缓存选区
      editor.addEventListener('mouseup', this.cacheRange);
      editor.addEventListener('touchend', this.cacheRange);
      editor.addEventListener('keyup', this.cacheRange);
    },
    
    // 缓存当前选区
    cacheRange() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        this.cachedRange = selection.getRangeAt(0).cloneRange();
      }
    },
    
    // 获取缓存的选区
    getCachedRange() {
      return this.cachedRange;
    },

    /**
     * 检查当前选区是否在指定格式中
     * @param {string} tagName - 标签名称
     * @returns {boolean}
     */
    isFormatActive(tagName) {
      const selection = window.getSelection();
      if (selection.rangeCount === 0) return false;

      const range = selection.getRangeAt(0);
      let container = range.commonAncestorContainer;
      
      // 如果光标在文本节点中，获取其父元素
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentNode;
      }
      
      // 向上查找是否包含指定格式标签
      while (container && container !== this.$refs.editor) {
        if (container.nodeType === Node.ELEMENT_NODE) {
          if (container.tagName.toLowerCase() === tagName) {
            return true;
          }
        }
        container = container.parentNode;
      }
      
      return false;
    },

    /**
     * 检查当前选区是否在指定列表中
     * @param {string} listTag - 列表标签名称 ('ul' 或 'ol')
     * @returns {boolean}
     */
    isInList(listTag) {
      const selection = window.getSelection();
      if (selection.rangeCount === 0) return false;

      const range = selection.getRangeAt(0);
      let container = range.startContainer;
      
      // 如果光标在文本节点中，获取其父元素
      if (container.nodeType === Node.TEXT_NODE) {
        container = container.parentNode;
      }
      
      // 向上查找是否在列表中
      while (container && container !== this.$refs.editor) {
        if (container.nodeType === Node.ELEMENT_NODE) {
          if (container.tagName.toLowerCase() === 'li') {
            const parentList = container.parentNode;
            if (parentList && parentList.tagName.toLowerCase() === listTag) {
              return true;
            }
          }
        }
        container = container.parentNode;
      }
      
      return false;
    }
  }
}).mount('#app');
