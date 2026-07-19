# AI 项目指令入口

本项目继承 `study` 仓库的统一规则。开始处理本项目任务前，必须先完整读取并遵守上级入口：

[../../AGENTS.md](../../AGENTS.md)

项目级协作约定请同时遵守 [PROJECT_CONVENTIONS.md](./PROJECT_CONVENTIONS.md)。

## 验证约束

禁止执行 build、test、lint、dev server 启动等编译或构建类命令。

- 不执行 `npm run build`、`npm run dev`、`npm run test`、`npm run lint` 等命令。
- 不执行 `npx`、`yarn` 或 `pnpm` 触发的同类命令。
- 不执行任何会触发编译、转译、打包或类型检查的命令。

需要验证代码时只做静态分析；未运行的验证项必须明确说明。
