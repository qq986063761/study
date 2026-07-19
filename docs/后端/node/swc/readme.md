# 资源
- [官网](https://swc.rs/)

# SWC
- 使用 Rust 编写的 JavaScript / TypeScript 编译器，定位类似 Babel + terser 的高性能替代方案。
- 常用于语法转译、JSX 转换、压缩，也被 Next.js、Rspack 等工具链使用。
- SWC 本身更偏编译器，不是完整前端工程脚手架。

# 能做什么
- 把新语法转换到指定浏览器或 Node.js 版本。
- 转换 TypeScript、React JSX。
- 压缩 JS。
- 通过插件或上层框架参与构建链路。

# 和 Babel 的区别
- Babel 生态成熟、插件多、可定制能力强。
- SWC 速度更快，适合大型项目提升编译速度。
- 如果项目依赖很多 Babel 插件或宏能力，迁移 SWC 前要确认兼容性。

# 和 ESBuild 的区别
- 两者都追求高性能；esbuild 更常用于 bundle、预构建、压缩的一体化场景。
- SWC 更像高性能编译器，经常被上层框架拿来替代 Babel 做转译。
- 都不会完整替代 TypeScript 类型检查，类型正确性仍要交给 `tsc` 或对应框架工具。

# 常见配置
```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true
    },
    "target": "es2018",
    "transform": {
      "react": {
        "runtime": "automatic"
      }
    }
  },
  "sourceMaps": true,
  "minify": true
}
```

# 面试重点
- SWC 主要解决编译速度问题，常见价值是替代 Babel 降低大型项目构建耗时。
- SWC 编译 TypeScript 时会移除类型，但不负责类型检查。
- Source Map 可开启，便于调试转译后的代码。
- 迁移时关注 Babel 插件兼容、polyfill 策略、装饰器语法配置、目标浏览器范围。
