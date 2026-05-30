// <T>定义泛型，泛型会根据传入的类型来作为类型规范
function getValue<T>(arg: T): T {
  return arg;
}

// 数组泛型
function getLogs<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}
function loggingIdentity<T>(arg: Array<T>): Array<T> {
  console.log(arg.length);
  return arg;
}

// 类泛型
function create<T>(c: {new(): T; }): T {
  return new c();
}

// 接口泛型
interface GenericIdentityFn<T> {
  (arg: T): T;
}
function identity<T>(arg: T): T {
  return arg;
}
// myIdentity 的类型为 (arg: number) => number
// 泛型接口 GenericIdentityFn<T> 将 T 传入为 number，所以 myIdentity 是一个接收 number 并返回 number 的函数
let myIdentity: GenericIdentityFn<number> = identity;

// 类泛型
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
let myGenericNumber = new GenericNumber<number>();

// 泛型继承
interface Lengthwise {
  length: number;
}
function logging<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// ========== 补充：keyof 操作符 ==========
// 获取对象类型的所有 key 组成的联合类型
interface UserInfo {
  id: number
  name: string
  age: number
}
// keyof 取出对象类型的所有 key 组成联合类型
type UserKey = keyof UserInfo  // "id" | "name" | "age"

// keyof 典型用法：配合泛型约束属性名，确保传入的 key 一定是 T 的属性
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// ========== 补充：in 映射类型 ==========
// 遍历联合类型，构造新的对象类型
type Keys = "name" | "age"
type UserMap = { [K in Keys]: string }  // { name: string; age: string }

// ========== 补充：条件类型 extends ? : ==========
type IsNumber<T> = T extends number ? "yes" : "no"
type A = IsNumber<42>   // "yes"
type B = IsNumber<"hi"> // "no"

// ========== 补充：infer 推断类型变量 ==========
// infer 的作用：在条件类型 extends 的「检查分支」中临时声明一个类型变量，
// 让 TypeScript 编译器自动「推断/提取」出该位置的类型，供 true 分支使用。
// 只有在条件类型中才能用 infer，且 infer 只能用在 extends 的右侧（被检查侧）。

// 从函数类型中推断返回值类型
// infer R 占据「返回值类型」的位置，T 满足 (...args: any[]) => ??? 时，
// 编译器把 ??? 的实际类型赋值给 R，然后在 true 分支返回 R
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type Str = MyReturnType<() => string>  // string  （R 被推断为 string）

// 从数组类型中推断元素类型
// infer U 占据「数组元素」的位置，T 满足 (???)[] 时，
// 编译器把 ??? 的实际类型赋值给 U，然后在 true 分支返回 U
type ElementType<T> = T extends (infer U)[] ? U : never
type Num = ElementType<number[]>  // number  （U 被推断为 number）

// ========== 补充：内置 Utility Types ==========

// Partial<T> —— 所有属性变可选
type PartialUser = Partial<UserInfo>  // { id?: number; name?: string; age?: number }

// Required<T> —— 所有属性变必填
type RequiredUser = Required<PartialUser>

// Readonly<T> —— 所有属性变只读
type ReadonlyUser = Readonly<UserInfo>

// Pick<T, K> —— 从 T 中挑出部分属性
type UserNameAndAge = Pick<UserInfo, "name" | "age">

// Omit<T, K> —— 从 T 中剔除部分属性
type UserWithoutId = Omit<UserInfo, "id">

// Record<K, T> —— 构造 K→T 的映射对象类型
type PageInfo = Record<"home" | "about", { title: string }>

// Exclude<T, U> —— 从联合类型 T 中排除 U
type NotNull = Exclude<string | null | undefined, null | undefined>  // string

// Extract<T, U> —— 从联合类型 T 中提取 U
type StrOnly = Extract<string | number | boolean, string>  // string

// NonNullable<T> —— 从 T 中排除 null/undefined
type NonNull = NonNullable<string | null | undefined>  // string

// ReturnType<T> —— 获取函数返回值类型
type FnReturn = ReturnType<() => string>  // string

// Parameters<T> —— 获取函数参数元组类型
type FnParams = Parameters<(a: string, b: number) => void>  // [string, number]

// ConstructorParameters<T> —— 获取构造函数参数元组
type CtorParams = ConstructorParameters<new (a: string) => Date>  // [string]

// InstanceType<T> —— 获取构造函数实例类型
type CtorInstance = InstanceType<new () => Date>  // Date

// ========== 补充：模板字面量类型 ==========
type World = `hello ${string}`
type Greeting = `hello ${"world" | "ts"}`  // "hello world" | "hello ts"

// 首字母大写等内置字符串工具类型
type Title = Capitalize<"hello">   // "Hello"
type Lower = Lowercase<"HELLO">    // "hello"
type Upper = Uppercase<"hello">    // "HELLO"
type Uncapitalized = Uncapitalize<"Hello">  // "hello"

// ========== 补充：satisfies 操作符 (TS 4.9+) ==========
// 检查类型兼容，但不改变 TypeScript 推断出的类型
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
} satisfies Record<string, string | number[]>
// palette.red 仍被推断为 number[]，而不是 string | number[]