# @monorepo-vue3-app/utils

共享的纯 TypeScript 工具包，适合放不依赖 Vue 运行时和浏览器状态的通用函数。

## Usage

```ts
import { clamp, formatDateTime, toArray } from '@monorepo-vue3-app/utils'

const tags = toArray('monorepo')
const percent = clamp(128, 0, 100)
const updatedAt = formatDateTime(Date.now())
```

这个包当前采用源码型 workspace 包模式，`exports` 指向 `src/index.ts`。Vite app 可以直接消费源码；如果以后要发布到 npm，再补充构建产物和打包工具。
