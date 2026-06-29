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

- 相同：都可以定义对象类型，都支持继承和泛型。
- 不同：
  - **interface 支持声明合并，type 不支持。**
    > 可以理解为：interface 可以多次补充定义，type 一个名字只能定义一次。

```ts
interface User {
  name: string;
}
interface User {
  age: number;
}
// => { name: string; age: number }

type Product = { title: string };
type Product = { price: number }; // ❌ 重复定义，报错
```

  - **type 能表示更多类型，interface 主要用于描述对象。**
    > interface 只能定义对象结构；type 还可以表示联合类型、元组、映射类型等。

```ts
// 联合类型
type Status = 'loading' | 'success' | 'error';

// 元组
type Point = [number, number];

// 映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

  - **type 更适合组合已有类型。**
    > 使用 Pick、Omit、Partial 等工具类型时，type 写法更简单、更常见。

```ts
type Base = {
  name: string;
  age: number;
  email: string;
};

type Preview =
  Pick<Base, 'name' | 'email'> & {
    extra: boolean;
  };

interface Preview2 extends Pick<Base, 'name' | 'email'> {
  extra: boolean;
}
```

> **实际开发建议：**
>
> - 普通对象优先用 `interface`。
> - 联合类型、工具类型、复杂类型组合优先用 `type`。

# 什么是泛型？它解决了什么问题？

> 泛型可以理解成**类型的占位符**，定义时不用指定具体类型，等调用时再确定具体是什么类型。

### 为什么要用泛型？

* **保留类型信息**

  * 避免使用 `any` 导致类型丢失。
  * 传入什么类型，返回就是什么类型，TypeScript 能一直推导出正确的类型。

* **类型安全**

  * 编译阶段就能发现类型错误，减少运行时异常。

* **代码复用**

  * 一套逻辑支持多种类型，不需要为 `string`、`number` 等重复写相同代码。

---

# 怎么限制泛型必须有哪些属性？

> 泛型默认可以接收任意类型，如果希望它必须具备某些属性，可以使用 **`extends`** 进行约束。

```ts
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("abc");       // ✅ string 有 length
logLength([1, 2, 3]);   // ✅ Array 有 length
logLength({ length: 1 });// ✅ 对象有 length
logLength(123);         // ❌ number 没有 length
```

### 白话理解

`extends` 就像给泛型设置了一个**门槛**：

* 不加 `extends`：什么类型都能传。
* 加了 `extends`：可以是任意类型，但**至少要满足指定的条件**。

例如：

```ts
T extends Lengthwise
```

表示：

> **T 不限制具体类型，但必须拥有 `length` 属性。**

# extends 能做什么？

> `extends` 可以理解成 **"加限制"** 或 **"设置条件"**，表示某个类型必须满足指定要求。

### 它解决了什么问题？

默认情况下，TypeScript 不会限制类型。

如果希望：

* 必须继承某个接口；
* 泛型必须具有某些属性；
* 根据类型不同返回不同结果；

都可以使用 `extends`。

---

## ① 接口继承

用于**复用已有接口**，避免重复定义相同属性。

```ts
interface Person {
  name: string;
}

interface Student extends Person {
  age: number;
}
```

表示：

> Student 拥有 Person 的所有属性，并可以扩展自己的属性。

---

## ② 泛型约束（最常用）

用于**限制泛型必须满足某些条件**。

```ts
function fn<T extends Record<string, unknown>>(obj: T) {}
```

表示：

> T 可以是任意对象，但不能是 number、string 等基本类型。

再比如：

```ts
interface Lengthwise {
  length: number;
}

function log<T extends Lengthwise>(arg: T) {}
```

表示：

> T 可以是任意类型，但必须有 `length` 属性。

---

## ③ 条件类型

根据类型不同，返回不同的结果。

```ts
type Result<T> = T extends string ? number : boolean;
```

表示：

* T 是 string，返回 number。
* 否则返回 boolean。

可以理解成：

> TypeScript 中的三元表达式。

```ts
条件 ? A : B
```

---

### 白话理解

`extends` 可以理解成：

> **"可以，但要满足条件。"**

例如：

* 接口：可以继承，但必须拥有父接口的属性。
* 泛型：可以传任何类型，但必须符合要求。
* 条件类型：根据是否满足条件，决定最终类型。

一句话总结：

> **extends 的核心作用就是给类型加限制、加条件。**

---

# keyof 作用是什么？

> `keyof` 可以理解成 **"取对象所有属性名"**。

### 它解决了什么问题？

如果直接写字符串作为属性名，很容易写错：

```ts
obj["naem"] // 拼写错误
```

TypeScript 无法提前发现。

使用 `keyof` 后，可以让属性名**只能从对象已有的 key 中选择**，提高类型安全。

---

## ① 获取所有 key

```ts
interface User {
  name: string;
  age: number;
}

type Keys = keyof User;
```

得到：

```ts
type Keys = "name" | "age";
```

也就是：

> 把接口中的所有属性名组成一个联合类型。

---

## ② 配合泛型约束（最常考）

```ts
function getProp<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
```

表示：

> `key` 必须是对象 `T` 中真实存在的属性。

例如：

```ts
const user = {
  name: "Tom",
  age: 18,
};

getProp(user, "name"); // ✅
getProp(user, "age");  // ✅
getProp(user, "sex");  // ❌ 不存在
```

---

### 白话理解

`keyof` 就像：

> **把对象的所有钥匙（属性名）都取出来。**

以后只能从这些钥匙里选择，而不能随便写。

一句话总结：

> **keyof 的核心作用就是获取对象所有属性名，并约束属性访问只能使用合法的 key，提高类型安全。**

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

# 常用 Utility Types 有哪些？
- `Partial<T>`：把所有属性变成可选。
- `Required<T>`：把所有属性变成必选。
- `Readonly<T>`：把所有属性变成只读。
- `Record<Keys, Type>`：构造一个属性名为 Keys，值为 Type 的对象类型。
- `Pick<T, K>`：选择 T 的部分属性。
- `Omit<T, K>`：从 T 中排除部分属性。
- `Exclude<T, U>`：从联合类型 T 中排除可以赋值给 U 的成员。
- `Extract<T, U>`：从联合类型 T 中提取可以赋值给 U 的成员。
- `NonNullable<T>`：剔除 null 和 undefined。
- `ReturnType<T>`：获取函数类型的返回值类型。
- `Parameters<T>`：获取函数类型的参数类型元组。
- `Awaited<T>`：获取 Promise 解包后的类型。

# 如何做 API 类型约束？
- 使用接口或类型定义请求参数与返回结果，避免接口改动后前端代码报错。
```ts
interface User {
  id: number;
  name: string;
}
interface ApiResponse<T> {
  code: number;
  data: T;
}

function fetchJson<T>(url: string): Promise<ApiResponse<T>> {
  return fetch(url).then(res => res.json());
}

async function getUser(id: number) {
  const res = await fetchJson<User>(`/api/user/${id}`);
  return res.data;
}
```
- `keyof` 和 `extends` 可用于实现通用表单/选项类型约束。

# 怎样实现前后端类型共享？
- 常见方案：`shared` 包、`npm workspace`、`monorepo`、`git submodule`，把接口类型抽取到公共库中。
- 通过 `type` / `interface` 共享 DTO，前端直接复用后端接口声明，减少接口文档不一致问题。
- 生成方案：OpenAPI / Swagger 生成 TypeScript 类型、`zod` schema 生成类型、`ts-morph` 或 `quicktype`。
- 编译产物：在前端项目中把共享类型目录加入 `tsconfig.json` 的 `include` 或 `paths`。

# TypeScript 的自动推导是怎样的？
- TS 可以从变量初始化、函数返回值、泛型参数、上下文类型推导出具体类型，减少显式书写。
- `as const` 可以让字面量保持更窄的类型，常用于动作类型、状态值等。
- `satisfies` 可以在保持具体类型的同时验证对象满足某个类型约束。
```ts
const action = {
  type: 'increment',
  payload: 1,
} as const;

const config = {
  timeout: 5000,
  mode: 'production',
} satisfies Record<string, number | string>;
```
- `infer` + 条件类型常用于实现自动推导工具类型，例如从函数类型提取参数或返回值。

# 怎样使用 schema 校验（zod）？
- `zod` 是一个 TypeScript 优先的运行时模式验证库，既做运行时校验，也能生成类型。
- 推荐做法：把 `zod` schema 作为接口声明的来源，避免类型和校验逻辑分离。
```ts
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

function parseUser(data: unknown) {
  return UserSchema.parse(data);
}
```
- `zod` 可用于前端表单校验、后端请求/响应验证、Shared schema 生成通用类型。

