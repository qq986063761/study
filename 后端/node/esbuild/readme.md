# 资源
- [官网](https://esbuild.github.io/)

# ESBuild
- 使用 Go 编写的 JavaScript / TypeScript 构建工具，特点是非常快。
- 常作为转译器、压缩器、依赖预构建工具使用，也可以直接做 bundle。
- Vite 开发环境的依赖预构建和 TS / JSX 转换大量依赖 esbuild。

# 能做什么
- 转换语法：TS、JSX、较新的 JS 语法转成目标环境可运行代码。
- 打包：把入口文件和依赖打成 bundle。
- 压缩：压缩 JS / CSS。
- 生成 source map：便于调试。
- Tree Shaking：基于 ESM 删除未使用导出。

# 基础命令
```bash
esbuild src/index.ts --bundle --outfile=dist/index.js --platform=browser --sourcemap
esbuild src/server.ts --bundle --platform=node --outfile=dist/server.js
```

# 常见配置点
```js
import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  platform: 'browser',
  target: ['es2018'],
  minify: true,
  sourcemap: true,
  splitting: true,
  format: 'esm'
})
```

# 面试重点
- 快的原因：Go 实现、并行处理、一次性完成解析/转换/打印，减少中间抽象开销。
- 不做类型检查：esbuild 会擦除 TypeScript 类型，但不会像 `tsc` 那样检查类型错误，项目里仍需要 `tsc --noEmit` 或框架配套检查。
- Tree Shaking 依赖 ESM 静态结构，CommonJS 和动态导入路径会影响优化效果。
- Code Splitting 需要 `splitting: true` 且输出格式为 `esm`，通常配合 `outdir` 使用。
- 适合追求速度的构建链路，但复杂生态插件、HTML 处理、框架深度集成通常交给 Vite、Webpack、Rollup 等上层工具。
