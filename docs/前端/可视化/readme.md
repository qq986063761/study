# 可视化库分类与选型建议

下面是对常见可视化库的分类整理与简要选型建议，便于在不同需求场景下快速选择。

## 分类

- 图表/可视化库
  - [ECharts](https://echarts.apache.org/zh/index.html)：适合统计图、地图与仪表盘，声明式配置、生态丰富，基于 `zrender`。
- Vue 可视化组件/面板
  - [vue data ui](https://vue-data-ui.graphieros.com/)：基于 Vue 的数据展示组件集合，适合快速搭建仪表盘与管理后台面板。
- 甘特/时间线
  - [frappe Gantt](https://frappe.io/gantt)：专注甘特图与任务排期，轻量易嵌入，适合项目排期展示。
- 脑图/结构化图
  - [Mind-elixir](https://docs.mind-elixir.com/zh-Hans/)：思维导图编辑与交互，适合知识梳理、树状结构编辑。
- Canvas 编辑与场景构建
  - [fabric.js](https://fabricjs.com/)：面向对象的 Canvas 编辑库，适合可拖拽、可编辑的图形编辑器与绘图工具。
- 高性能 Canvas/图层管理
  - [Konva](https://konvajs.org/api/Konva.html)：提供图层管理与事件，适合复杂交互、动画与高性能 2D 场景。
- 2D 渲染引擎（底层）
  - [zrender](https://ecomfe.github.io/zrender-doc/public/)：轻量 2D 绘制引擎，ECharts 的渲染底层，适合自建图形渲染层。
- WebGL 高性能渲染
  - [PixiJS](https://pixijs.com/)：基于 WebGL 的 2D 渲染引擎，适合大量精灵、复杂动画或拟游戏化的可视化场景。

## 快速选型建议

- 需要快速做统计图、地图或大盘 → 选择 ECharts（Vue 项目可与 `vue data ui` 配合使用）。
- 需要甘特/排期展示 → 选择 frappe Gantt。
- 需要脑图/思维导图编辑 → 选择 Mind-elixir。
- 需要可编辑的画布（对象拖拽、属性编辑）→ 优先考虑 fabric.js；若关注更好性能与图层管理，考虑 Konva。
- 需要底层绘制能力或自定义渲染 → 使用 zrender 或基于其实现定制层。
- 需要大量精灵、动画或高性能 2D 渲染 → 选择 PixiJS（WebGL）。

---

如需，我可以把这个文件复制到项目仓库的指定位置，或根据你的项目技术栈（Vue/React）给出更具体的集成示例。
