# 资源
- [文档](https://www.tslang.cn/docs/home.html);

# 编译
- 安装编译器：npm install -g typescript;
- 编译代码：tsc demo.ts;
- 安装直接编译运行的包：npm install -g ts-node
- 直接运行 ts 文件：ts-node demo.ts

# 好处
- 类型检查：编码时就能快速检测、抛出类型错误
- 避免低级错误

# interface 和 type 的区别
- 相同：都能描述对象类型，支持继承、泛型
- 不同：
  - interface 支持合并，type 不支持合并会报错
```ts
  // ✅ interface 同名自动合并
  interface User {
    name: string;
  }
  interface User {
    age: number;
  }
  // 最终 User 变成了 { name: string; age: number }
  const u: User = { name: 'Tom', age: 18 };

  // ❌ type 同名会报错：标识符“Product”重复
  type Product = { title: string };
  type Product = { price: number }; // ❌ 错误！
```
  - type 能表达联合类型、元组、映射类型，interface 不能
```ts
// 1. 联合类型 —— interface 做不到
type Status = 'loading' | 'success' | 'error';
let s: Status = 'loading';

// 2. 元组 —— interface 做不到
type Point = [number, number];
const p: Point = [10, 20];

// 3. 映射类型 —— interface 做不到
// 把一个类型的所有属性变成只读
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
type ReadonlyUser = Readonly<{ name: string; age: number }>;
// ReadonlyUser 是 { readonly name: string; readonly age: number }
```
  - type 更适合工具类型的组合，更方便
```ts
type Base = {
  name: string;
  age: number;
  email: string;
};

// ✅ type 接住 Pick，并直接交叉一个额外属性
type Preview = Pick<Base, 'name' | 'email'> & { extra: boolean };
const obj: Preview = { name: 'Alice', email: 'a@b.com', extra: true };

// ❌ interface 不能直接等于工具类型的返回值
// 下面写法是错的：
interface Wrong = Pick<Base, 'name' | 'email'>; // ❌ 语法错误

// ✅ interface 只能 extends 继承，但无法直接做交叉联合
interface Okay extends Pick<Base, 'name' | 'email'> {
  extra: boolean;
}
// 虽然 Okay 能用，但在更复杂的类型里（比如需要交叉多个工具类型，或使用条件类型），
// type 内联组合要方便得多。
```

# 什么是泛型？它解决了什么问题？
- 不指明具体类型，调用时才指明，能保留具体的类型信息；
  - 类型安全：可以避免用 any 导致类型丢失；
  - 代码复用：同一段逻辑可支持多种类型；

# 怎么限制泛型必须有哪些属性？
- 泛型中用 extends 继承接口
```ts
interface Lengthwise {
  length: number;
}
function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("abc");   // ✅
logLength([1,2,3]); // ✅
logLength(123);     // ❌ 类型错误，没有 length
```

# extends 能做什么
- 接口继承：interface B extends A {}
- 泛型约束：<T extends Record<string, unknown>>，表示 T 必须是 { string: 任何类型 } 这样的结构
- 条件类型：T extends U ? X : Y。

# keyof 作用是什么
- 可以取出 interface 中的 key 组成联合类型
- 可以利用 keyof 约束比如 getProp<T, K extends keyof T>(obj: T, key: K): T[K] 函数中的属性key必须在类型T中

# infer 作用是什么
- 常用来在条件类型中用作推导
```ts
type FirstArg<T> = T extends (first: infer F, ...args: any[]) => any ? F : never;
type A = FirstArg<(x: number, y: string) => void>; // number
```

# any、unknown、never 有什么区别
- any：完全跳出类型检查，可赋值给任何变量，也可被任何值赋值，极易导致运行时错误。应尽量避免，除非临时迁移 JS 代码。
- unknown：比 any 安全，可接收任何类型，但是想用它必须要用 typeof、instanceof 确认类型后再继续，否则报错
```ts
function handle(data: unknown) {
  // 必须先检查类型
  if (typeof data === 'string') {
    console.log(data.toUpperCase()) // 现在安全了
  }
}
```
- never：表示永远不会出现的类型。一般用在抛异常或死循环的函数返回值
```ts
function fail(): never { throw new Error() } // 方法不会正常结束
type A = string & number // never
```

# TypeScript 的类型推导机制是怎样的？什么情况下必须显式声明类型？
- 自动推导：变量初始化、函数默认参数、返回值可被自动推导，减少多余代码。
```ts
let name = "小明"  // TS 自己推导出 name 是 string
let age = 18       // 推导出 age 是 number

function add(a: number, b = 6) { // 函数默认参数
  return a + b  // TS 知道返回的是 number
}
```
- 必须显式声明的场景：
  - 函数参数，否则会隐式 any（开启 noImplicitAny 时报错）。
  - 声明但是没有初始化的变量。
  - 某些递归或复杂场景无法推导。
  - 为对象字面量添加额外约束（如后续要添加属性）。
```ts
function greet(name) {  // noImplicitAny 开启后会报错：参数会被认为是 any
  return '你好' + name
}

let result; // TS 推导为 any，很危险

function deepClone<T>(obj: T): T {
  // 很复杂的实现，返回类型有时推断不出来，就明确告诉它返回和输入类型一样
}

// 提前告诉对象内是什么字段类型，让它规范对象属性类型
const config: { name: string; age?: number } = { name: '默认' }
```

# 什么是类型守卫，类型谓词
- 类型守卫：在条件分支中自动缩窄变量的类型，包括：typeof、instanceof、in、== 字面量比较、Array.isArray 等。
- 自定义类型谓词：parameterName is Type，函数返回布尔值时告诉编译器缩窄结论。
```ts
interface Cat { meow: () => void }
interface Dog { bark: () => void }
function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined
}
// 使用后 if (isCat(animal)) 分支内 animal 自动缩窄为 Cat，ts 不会报错，animal is Cat 告诉 ts 通过就返回就确认是 Cat 了，不然就要手动用 animal as Cat 明确具体类型
```

