# 资源
- [官网中文](https://www.rollupjs.com/)

# Rollup
- JavaScript 模块打包器，以 ESM 为核心，适合打包类库、组件库、SDK。
- Vite 生产构建默认使用 Rollup，所以理解 Rollup 有助于理解 Vite 的产物优化。
- 相比 Webpack，Rollup 更偏“把一组 ESM 模块打成干净产物”；Webpack 更偏完整应用构建和复杂资源处理。

# 适用场景
- 组件库、工具库、SDK 需要输出 `esm`、`cjs`、`umd` 多种格式。
- 希望产物结构清晰、Tree Shaking 效果好。
- 前端应用也可以打包，但复杂应用通常直接使用 Vite / Webpack / Rspack 这类更完整的工程工具。

# 基础配置
```js
// rollup.config.js
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true
    }
  ],
  external: ['vue'],
  plugins: [typescript(), terser()]
}
```

# Tree Shaking
- Rollup 基于 ESM 静态结构分析导入导出，删除没有被使用的代码。
- 类库最好提供 ESM 入口，并减少模块顶层副作用。
- `external` 可以把 `vue`、`react` 这类 peer dependency 排除在产物外，避免重复打包。

# Code Splitting 和懒加载
- 多入口或动态 `import()` 会触发代码拆分。
- 输出目录需要使用 `output.dir`，不能只写单个 `output.file`。
```js
export default {
  input: {
    main: 'src/main.js',
    admin: 'src/admin.js'
  },
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true
  }
}
```
- 可以用 `manualChunks` 手动拆公共依赖，但类库要谨慎，避免给使用方制造过多碎片文件。

# Source Map
- `output.sourcemap: true` 会生成 source map。
- 类库发布时通常保留 source map 方便使用方调试；业务项目可按部署策略决定是否公开。

# 常见追问
- Rollup 为什么 Tree Shaking 好：它从 ESM 静态依赖图出发，能在构建期判断哪些导出没有被使用。
- Rollup 和 Webpack 的区别：Rollup 更适合库，Webpack 更适合复杂应用；Vite 在生产阶段借助 Rollup。
- `dependencies` 和 `peerDependencies` 如何处理：库里通常把宿主必须提供的框架放到 `peerDependencies`，并在 Rollup 中 `external` 掉。
