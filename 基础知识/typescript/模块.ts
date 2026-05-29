// export 用于导出模块对象
// 可以通过 import { func } from './module' 引入
export function func () {}

// ========== 补充：仅导入/导出类型 import type / export type ==========
// 编译后会被完全擦除，不产生实际 JS 代码
import type { UserInfo } from "./泛型"
export type { UserInfo }

// ========== 补充：declare 声明外部变量/模块/全局类型 ==========
// 声明全局变量（常用于告诉 TS 某个 JS 变量的类型）
declare var jQuery: (selector: string) => any

// 声明模块（为没有类型的 JS 库提供类型）
declare module "*.vue" {
  const comp: any
  export default comp
}

// 声明全局函数
declare function gettext(key: string): string

// 声明全局类型（放在 .d.ts 文件中可全局使用，无需 import）
declare global {
  interface Window {
    __CUSTOM_CONFIG__: { apiUrl: string }
  }
}

// ========== 补充：命名空间 namespace ==========
// 旧式模块组织方式（现代项目多用 ES Module 替代）
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean
  }
  export function isNumber(s: string): boolean {
    return !isNaN(Number(s))
  }
}
// 使用：Validation.isNumber("42")