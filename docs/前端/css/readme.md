# CSS / UI 样式库收集

## 动画与交互效果

- [csshake](https://elrumordelaluz.github.io/csshake/)
  - 用途：专门做“抖动”动画的 CSS 库。
  - 适合：表单校验失败、按钮错误反馈、提示用户注意某个元素。
  - 特点：提供 `shake`、`shake-hard`、`shake-slow`、`shake-horizontal`、`shake-vertical` 等预设类名。
  - 备注：功能很专一，只适合强调反馈，不适合作为完整动画体系。

- [animate.css](https://animate.style/)
  - 用途：通用 CSS 动画库。
  - 适合：页面元素入场、出场、强调动画，例如淡入、滑入、弹跳、缩放、翻转。
  - 特点：开箱即用，给元素加指定 class 就能使用动画。
  - 备注：适合快速做效果；大型项目里要注意动画不要滥用，否则页面会显得杂乱。

- [hover.css](https://ianlunn.github.io/Hover/)
  - 用途：专注 hover 状态的 CSS3 动效库。
  - 适合：按钮、链接、卡片、图片、图标的鼠标悬停反馈。
  - 特点：包含 2D transforms、背景过渡、边框动画、阴影动画、图标动画等。
  - 备注：更适合 PC 端；移动端没有稳定 hover 交互，使用价值有限。

## CSS 框架 / 原子化样式

- [Tailwind CSS](https://tailwindcss.com/)
  - 用途：Utility-First 原子化 CSS 框架。
  - 适合：快速搭页面、做后台系统、做设计系统、减少手写 CSS 文件。
  - 特点：通过组合类名完成布局、颜色、间距、字体、响应式等样式，例如 `flex`、`pt-4`、`text-center`。
  - 备注：优点是开发快、约束强；缺点是 HTML class 会比较长，需要团队接受这种写法。

- [Tailwind CSS 中文](https://www.tailwindcss.cn/)
  - 用途：Tailwind CSS 的中文文档站。
  - 适合：学习 Tailwind 概念、查工具类、给中文团队快速入门。
  - 特点：不是另一个框架，本质还是 Tailwind CSS，只是文档语言不同。
  - 备注：查最新 API 时，最好同时对照英文官网。

## 组件方案 / 设计系统

- [shadcn/ui](https://ui.shadcn.com/)
  - 用途：基于 Tailwind CSS 的组件方案。
  - 适合：React 项目快速搭建高质量组件，例如按钮、表单、弹窗、表格、菜单。
  - 特点：不是传统 npm 组件库，而是把组件源码复制到你的项目里，方便二次修改。
  - 备注：适合想掌控组件源码的项目；如果只想安装即用，可能不如 Ant Design、Element Plus 这类组件库直接。

- [Astryx Design](https://astryx.atmeta.com/)
  - 用途：Meta 开源的设计系统。
  - 适合：学习大型设计系统如何组织组件、模板、主题和设计规范。
  - 特点：目前是 Beta，基于 React 和 StyleX，包含组件、模板、主题和 playground。
  - 备注：更适合作为设计系统参考；如果是 Vue 项目，不能直接当 Vue 组件库使用。

## CSS-in-JS / 样式系统

- [StyleX](https://stylexjs.com/)
  - 用途：Meta 的样式系统，用 JS/TS 写样式，再编译成高性能 CSS。
  - 适合：React 大型应用、需要类型安全、主题能力、可组合样式和稳定样式约束的项目。
  - 特点：强调类型安全、可组合、可预测、可主题化。
  - 备注：不是传统 CSS 文件库，也不是 Tailwind 这种 class 工具库；更像工程化样式方案。

## 简单选择建议

| 场景 | 可以看 |
| --- | --- |
| 想给错误提示加抖动 | `csshake` |
| 想快速加通用动画 | `animate.css` |
| 想做按钮/卡片 hover 效果 | `hover.css` |
| 想用原子化 CSS 搭页面 | `Tailwind CSS` |
| 想找 Tailwind 中文资料 | `Tailwind CSS 中文` |
| React + Tailwind 想要可复制组件 | `shadcn/ui` |
| 想研究大型设计系统 | `Astryx Design` |
| React 大项目想要类型安全样式系统 | `StyleX` |
