# Dart 语言要点（理论向）

Dart 是面向对象、类基于单继承的编程语言，由 Google 设计，常用于 Flutter、服务端（Dart VM）与命令行工具。下面按「语言模型 → 类型与空安全 → 异步 → 生态」做极简梳理。

## 语言模型

- **一切皆对象**：数字、函数、`null` 等均为对象；没有原始类型与包装类型的分裂（使用上统一）。
- **基于类与 mixin**：单继承 + `mixin` 组合行为，接口通过「隐式接口」（每个类即接口）实现。
- **顶层入口**：`main()` 为程序入口；库通过 `import` / `export` 组织，支持 `part` 拆分大文件。

## 类型系统与空安全（Sound null safety）

- **静态类型 + 类型推断**：多数位置可写类型，也可用 `var` / `final` 由编译器推断。
- **可空与非空**：`String` 不可为 `null`，`String?` 可为 `null`；访问可空类型前需判空、`?.`、`!` 或 `??` 等，减少 NPE 类问题。
- **后期绑定**：`late` 表示稍后初始化，适用于依赖注入或 `initState` 后再赋值的场景。

## 函数与闭包

- **一等函数**：函数可作参数、返回值；闭包捕获外层变量。
- **命名参数与可选参数**：`{}` 命名、`[]` 位置可选，支持默认值，利于可读 API 设计。

## 异步模型

- **`async` / `await`**：基于 **Future**（单次异步）与 **Stream**（事件序列）。
- **事件循环**：Dart 在单线程 isolate 中运行事件循环；CPU 密集任务可用 `Isolate` 或 `compute` 避免阻塞 UI。

## 面向对象特性

- **构造器**：命名构造、工厂构造 `factory`、初始化列表、重定向构造。
- **扩展方法 `extension`**：在不修改原类的前提下为类型增加方法。
- **枚举增强**：可带成员、可实现接口，适合有限状态建模。

## 与 Flutter 的关系

- UI 使用 **声明式**：`Widget` 描述配置，框架根据 `State` 变化做 **diff 与重建**；业务状态常放在 `State` / `InheritedWidget` / **Provider、Riverpod、Bloc** 等方案中。
- **Dart 是 Flutter 的单一语言栈**：同一套类型与工具链覆盖逻辑、界面与部分构建脚本。

## 延伸阅读

- 官方语言概览：<https://dart.dev/overview>
- 空安全说明：<https://dart.dev/null-safety>
- 异步教程：<https://dart.dev/codelabs/async-await>
