# 富文本编辑器

一个基于Vue 3 CDN的现代化富文本编辑器，具有完整的格式化功能。

## 功能特性

### 文本格式
- **标题切换**: 支持H1-H6标题和正文切换
- **字体大小**: 预设字体大小选择 + 自定义字体大小输入
- **颜色设置**: 前景色和背景色选择
- **文本样式**: 粗体、斜体、下划线、中划线
- **文本对齐**: 左对齐、居中、右对齐、两端对齐

### 列表功能
- **无序列表**: 项目符号列表
- **有序列表**: 数字编号列表
- **缩进控制**: 增加/减少缩进

### 高级功能
- **表格插入**: 3x3表格模板
- **链接插入**: 支持外部链接
- **全屏模式**: 全屏编辑体验
- **格式清除**: 一键清除所有格式
- **HTML导出**: 获取生成的HTML代码

## 文件结构

```
native/
├── index.html          # 主页面
├── styles.css         # 样式文件
├── editor.js          # Vue主应用
├── heading.js         # 标题功能
├── fontSize.js        # 字体大小功能
├── customFontSize.js  # 自定义字体大小
├── foreColor.js       # 前景色功能
├── backColor.js       # 背景色功能
├── textFormat.js      # 文本格式功能
├── alignment.js       # 对齐功能
├── list.js           # 列表功能
├── table.js          # 表格功能
├── link.js           # 链接功能
├── fullscreen.js     # 全屏功能
├── utils.js          # 工具功能
├── test.html         # 测试页面
└── README.md         # 说明文档
```

## 使用方法

1. 直接打开 `index.html` 文件
2. 在编辑器中输入内容
3. 使用工具栏进行格式化
4. 点击"获取HTML"查看生成的代码

## 快捷键

- `Ctrl + B`: 粗体
- `Ctrl + I`: 斜体
- `Tab`: 增加缩进
- `Shift + Tab`: 减少缩进
- `ESC`: 退出全屏

## 技术特点

- **Vue 3 CDN**: 使用Vue 3 Composition API
- **数据驱动**: 工具栏完全由数据配置驱动，使用v-for循环渲染
- **模块化设计**: 每个功能独立一个JS文件
- **响应式**: 支持全屏模式
- **现代CSS**: 使用Flexbox和Grid布局
- **键盘支持**: 完整的快捷键支持
- **配置化**: 所有工具栏配置都在JavaScript数据中，易于维护和扩展

## 浏览器兼容性

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 开发说明

### 数据驱动架构

工具栏完全由数据配置驱动，通过Vue的v-for循环自动渲染：

```javascript
// 工具栏配置示例
toolbarGroups: [
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
      }
    ]
  }
]
```

### 功能模块

每个功能模块都是独立的类，通过Vue应用进行统一管理：

```javascript
// 功能模块示例
class FeatureManager {
  constructor(vueApp) {
    this.app = vueApp;
    this.editor = null;
  }
  
  getEditor() {
    if (!this.editor) {
      this.editor = this.app.$refs.editor;
    }
    return this.editor;
  }
  
  // 功能方法
  doSomething() {
    // 实现功能
  }
}
```

### 添加新功能

要添加新的工具栏功能，只需在`toolbarGroups`数组中添加新的配置项：

```javascript
{
  id: 'newFeature',
  type: 'buttons',
  buttons: [
    {
      id: 'newButton',
      content: '新功能',
      title: '新功能按钮',
      active: false,
      action: () => this.newFeature()
    }
  ]
}
```

## 测试

打开 `test.html` 查看功能测试说明，或直接使用 `index.html` 进行实际测试。
