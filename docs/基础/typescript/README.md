# TypeScript

## 资源

- [文档](https://www.tslang.cn/docs/home.html);

## 编译

- 安装编译器：npm install -g typescript;
- 编译代码：tsc demo.ts;
- 安装直接编译运行的包：npm install -g ts-node
- 直接运行 ts 文件：ts-node demo.ts

## 好处

- 类型检查：编码时就能快速检测、抛出类型错误
- 避免低级错误

## interface 和 type 的区别

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

## 联合类型（`|`）和交叉类型（`&`）

### 联合类型（`|`）

> 联合类型表示**一个值可以是多种类型中的任意一种**。

#### 它解决了什么问题？

实际开发中，一个变量并不一定只有一种类型。

例如：

* 接口返回的数据可能成功，也可能失败。
* 输入框的值可能是 `string`，也可能是 `number`。
* 函数参数可以接收多种类型。

这时候就不用使用 `any`，而是使用联合类型。

```ts
let value: string | number;

value = "Tom";
value = 18;
```

#### 白话理解

可以理解成：

> **满足其中任意一种类型即可。**

例如：

```ts
string | number
```

表示：

> **要么是 `string`，要么是 `number`。**

使用时通常需要配合类型守卫判断：

```ts
function print(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
```

---

### 交叉类型（`&`）

> 交叉类型表示**把多个类型合并成一个类型**。

#### 它解决了什么问题？

有时候希望一个对象同时拥有多个类型的属性。

例如：

```ts
interface Person {
  name: string;
}

interface Worker {
  salary: number;
}

type Employee = Person & Worker;
```

得到：

```ts
type Employee = {
  name: string;
  salary: number;
}
```

这样：

```ts
const emp: Employee = {
  name: "Tom",
  salary: 10000,
};
```

#### 白话理解

可以理解成：

> **必须同时满足所有类型。**

例如：

```ts
Person & Worker
```

表示：

> **既是 `Person`，也是 `Worker`。**

---

#### 一句话总结

* **`|`（联合类型）**：满足其中一种类型即可。
* **`&`（交叉类型）**：必须同时满足所有类型。

---

## 什么是类型断言（`as`）？

> 类型断言可以理解成 **"告诉 TypeScript：这个值是什么类型，我比你更清楚。"**

### 它解决了什么问题？

有时候 TypeScript 无法准确推导变量的类型，但开发者已经知道它的真实类型。

这时可以使用 `as` 明确告诉 TypeScript。

例如：

```ts
const el = document.querySelector("#app");
```

TS 推导：

```ts
Element | null
```

但实际上：

我们知道它一定是：

```ts
HTMLDivElement
```

可以写：

```ts
const div = el as HTMLDivElement;
```

这样：

```ts
div.innerHTML = "Hello";
```

就不会报类型错误。

---

#### 什么时候会用到？

常见场景：

* DOM 元素获取
* 类型守卫无法推导时
* 第三方库类型不准确
* 开发者比 TypeScript 更清楚变量类型

例如：

```ts
const input = document.querySelector("#username") as HTMLInputElement;
input.value = "Tom";
```

---

#### 白话理解

可以理解成：

> **TypeScript 不确定它是什么类型，而你确定，所以主动告诉它。**

需要注意：

> **`as` 只影响 TypeScript 的类型检查，不会修改运行时的数据。**

例如：

```ts
const num = "123" as unknown as number;
```

运行时：

```ts
console.log(num);
```

输出仍然是：

```txt
123
```

它不会真的变成数字。

---

#### 一句话总结

> **`as` 的作用是手动指定变量的类型，让 TypeScript 按照指定的类型进行检查，但不会改变变量真正的数据类型。**

> 什么时候不用 as：**能让 TypeScript 自动推导时，就不要使用 `as`；只有当 TypeScript 无法正确推导，而开发者明确知道实际类型时，再使用 `as`。过度使用 `as` 会绕过类型检查，降低 TypeScript 的类型安全。**

## 什么是泛型？它解决了什么问题？

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

## 怎么限制泛型必须有哪些属性？

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

## extends 能做什么？

> `extends` 可以理解成 **"加限制"** 或 **"设置条件"**，表示某个类型必须满足指定要求。

### 它解决了什么问题？

默认情况下，TypeScript 不会限制类型。

如果希望：

* 必须继承某个接口；
* 泛型必须具有某些属性；
* 根据类型不同返回不同结果；

都可以使用 `extends`。

---

### ① 接口继承

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

### ② 泛型约束（最常用）

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

### ③ 条件类型

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

#### 白话理解

`extends` 可以理解成：

> **"可以，但要满足条件。"**

例如：

* 接口：可以继承，但必须拥有父接口的属性。
* 泛型：可以传任何类型，但必须符合要求。
* 条件类型：根据是否满足条件，决定最终类型。

一句话总结：

> **extends 的核心作用就是给类型加限制、加条件。**

---

## keyof 作用是什么？

> `keyof` 可以理解成 **"取对象所有属性名"**。

### 它解决了什么问题？

如果直接写字符串作为属性名，很容易写错：

```ts
obj["naem"] // 拼写错误
```

TypeScript 无法提前发现。

使用 `keyof` 后，可以让属性名**只能从对象已有的 key 中选择**，提高类型安全。

---

### ① 获取所有 key

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

### ② 配合泛型约束（最常考）

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

#### 白话理解

`keyof` 就像：

> **把对象的所有钥匙（属性名）都取出来。**

以后只能从这些钥匙里选择，而不能随便写。

一句话总结：

> **keyof 的核心作用就是获取对象所有属性名，并约束属性访问只能使用合法的 key，提高类型安全。**

## infer 作用是什么？

> `infer` 可以理解成 **"自动提取类型"**，通常配合条件类型使用。

### 它解决了什么问题？

有时候我们知道一个类型的结构，但不知道里面具体的类型。

例如：

* 想获取函数第一个参数类型；
* 想获取 Promise 包裹的数据类型；
* 想获取数组元素类型。

这时可以使用 `infer` 自动推导，而不用手动写死类型。

```ts
type FirstArg<T> =
  T extends (first: infer F, ...args: any[]) => any
    ? F
    : never;

type A = FirstArg<(x: number, y: string) => void>;
// number
```

#### 白话理解

`infer` 就像：

> **"帮我把里面的类型拿出来。"**

例如：

```ts
Promise<string>
```

使用 `infer` 可以自动拿到：

```ts
string
```

一句话总结：

> **infer 的作用就是从已有类型中自动提取需要的类型。**

---

## 常用 Utility Types（工具类型）

> Utility Types 是 TypeScript 内置的一些工具类型，用来**快速修改已有类型**，避免重复定义相同的类型。

### ⭐⭐⭐⭐⭐ 必会

#### `Partial<T>`

> **把所有属性变成可选。**

**解决什么问题？**

更新数据时，通常只需要修改部分字段，不需要把整个对象都传一遍。

常用于：

* 编辑表单
* 更新接口（Update）

```ts
interface User {
  name: string;
  age: number;
}

type UpdateUser = Partial<User>;
// { name?: string; age?: number }
```

---

#### `Pick<T, K>`

> **从已有类型中挑选指定属性。**

**解决什么问题？**

避免重新定义一个只包含部分字段的新类型。

常用于：

* 列表页
* 简化接口返回数据

```ts
type UserInfo = Pick<User, "name">;
// { name: string }
```

---

#### `Omit<T, K>`

> **从已有类型中排除指定属性。**

**解决什么问题？**

已有类型基本都需要，只是不想要其中几个字段。

常用于：

* 去掉 `id`
* 去掉密码等敏感字段

```ts
type CreateUser = Omit<User, "id">;
```

---

#### `Record<K, T>`

> **快速创建一个对象类型。**

**解决什么问题？**

不用一个个写对象属性，统一指定 key 和 value 的类型。

常用于：

* 字典对象
* 配置项
* 接口缓存

```ts
type UserMap = Record<string, User>;
```

等价于：

```ts
{
  [key: string]: User;
}
```

---

#### `Readonly<T>`

> **把所有属性变成只读。**

**解决什么问题？**

防止对象被意外修改。

常用于：

* 配置对象
* 常量数据

```ts
const config: Readonly<User> = {
  name: "Tom",
  age: 18,
};

// ❌ 无法修改
config.name = "Jack";
```

---

### ⭐⭐⭐⭐ 经常问

#### `ReturnType<T>`

> **获取函数返回值类型。**

**解决什么问题？**

避免函数返回类型修改后，还要同步修改其它地方的类型。

```ts
function getUser() {
  return {
    name: "Tom",
    age: 18,
  };
}

type User = ReturnType<typeof getUser>;
```

---

#### `Parameters<T>`

> **获取函数参数类型（返回元组）。**

**解决什么问题？**

需要复用函数参数类型时，不用重复定义。

```ts
function login(name: string, age: number) {}

type Params = Parameters<typeof login>;
// [string, number]
```

---

### ⭐⭐⭐ 知道即可

#### `Exclude<T, U>`

> **从联合类型中排除指定类型。**

```ts
type A = Exclude<string | number | boolean, number>;
// string | boolean
```

---

#### `Extract<T, U>`

> **从联合类型中提取指定类型。**

```ts
type A = Extract<string | number | boolean, number>;
// number
```

---

#### `NonNullable<T>`

> **去掉 `null` 和 `undefined`。**

```ts
type A = NonNullable<string | null | undefined>;
// string
```

---

#### `Awaited<T>`

> **获取 Promise 最终返回的数据类型。**

```ts
type A = Awaited<Promise<string>>;
// string
```

---

#### `Required<T>`

> **把所有可选属性变成必选。**

```ts
interface User {
  name?: string;
  age?: number;
}

type A = Required<User>;
// { name: string; age: number }
```

---

### 面试高频

如果面试官问：

> **项目里最常用哪些 Utility Types？**

可以回答：

> **`Partial`、`Pick`、`Omit`、`Record`、`Readonly` 用得最多；`ReturnType` 和 `Parameters` 在封装公共方法、工具函数时也比较常用。其他像 `Exclude`、`Extract`、`NonNullable`、`Awaited`、`Required` 更多是在工具类型或框架源码中见得比较多。**

## any、unknown、never 有什么区别？

### any

> **放弃类型检查。**

#### 它解决了什么问题？

适合临时兼容旧 JavaScript 代码，或者类型暂时无法确定。

缺点：

* 可以赋值给任何类型。
* 可以调用任何方法。
* TypeScript 不再帮你检查类型，容易导致运行时错误。

```ts
let data: any = "hello";

data.toFixed(); // 编译不报错，运行时报错
```

一句话总结：

> **能不用 `any` 就尽量不用。**

---

### unknown

> **可以接收任何类型，但使用前必须先判断类型。**

#### 它解决了什么问题？

既希望接收任意数据，又希望保证类型安全。

```ts
function handle(data: unknown) {
  if (typeof data === "string") {
    console.log(data.toUpperCase());
  }
}
```

#### 白话理解

可以理解成：

> **"我不知道它是什么类型，你先检查，再使用。"**

一句话总结：

> **unknown 比 any 更安全。**

---

### never

> **表示永远不会出现的类型。**

#### 它解决了什么问题？

用于表示：

* 不会正常返回的函数；
* 不可能出现的类型。

例如：

```ts
function fail(): never {
  throw new Error();
}
```

因为：

函数永远不会执行到结束。

再例如：

```ts
type A = string & number;
// never
```

因为：

一个值不可能同时是 `string` 和 `number`。

一句话总结：

> **never 表示"不存在"或"永远不会发生"。**

---

## TypeScript 的类型推导机制是怎样的？什么情况下必须显式声明类型？

> TypeScript 最大的特点就是**很多类型不用自己写，它会自动推导出来。**

### 自动推导

例如：

```ts
let name = "小明";
// 推导为 string

let age = 18;
// 推导为 number

function add(a: number, b = 6) {
  return a + b;
}
// 返回值自动推导为 number
```

#### 它解决了什么问题？

减少重复写类型，提高开发效率。

例如：

不用写：

```ts
let age: number = 18;
```

直接：

```ts
let age = 18;
```

TypeScript 自己就知道是 `number`。

---

### 什么情况下必须自己声明类型？

#### ① 函数参数

TS 无法知道别人会传什么类型。

```ts
function greet(name: string) {
  return "你好 " + name;
}
```

否则开启 `noImplicitAny` 后会报错。

---

#### ② 变量没有初始化

```ts
let result: number;
```

因为：

```ts
let result;
```

TS 不知道它是什么类型。

---

#### ③ 返回类型比较复杂

例如：

泛型、递归、复杂工具函数。

```ts
function deepClone<T>(obj: T): T {
  // ...
}
```

明确返回类型，可读性更好，也避免推导错误。

---

#### ④ 希望对象遵循固定结构

```ts
const config: {
  name: string;
  age?: number;
} = {
  name: "默认",
};
```

表示：

> 这个对象以后只能按照这个结构使用。

---

#### 一句话总结

> **TypeScript 能推导的就让它推导，推导不了或希望限制更严格时，再手动声明类型。**

## 什么是类型守卫、类型谓词？

### 类型守卫（Type Guard）

> 类型守卫可以理解成 **"帮助 TypeScript 判断变量真实类型"**。

#### 它解决了什么问题？

当一个变量可能有多种类型时：

```ts
Cat | Dog
```

TypeScript 不知道它到底是哪一种，所以不能直接访问对应的方法。

类型守卫就是告诉 TS：

> **经过判断后，这个变量现在可以确定是什么类型。**

常见的类型守卫：

* `typeof`
* `instanceof`
* `in`
* `===` 字面量比较
* `Array.isArray()`

---

### 自定义类型谓词

> 当内置类型守卫不够用时，可以自己定义判断逻辑。

```ts
interface Cat {
  meow: () => void;
}

interface Dog {
  bark: () => void;
}

function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined;
}
```

使用：

```ts
if (isCat(animal)) {
  animal.meow(); // ✅ TS 知道这里一定是 Cat
} else {
  animal.bark(); // ✅ TS 知道这里一定是 Dog
}
```

#### 白话理解

```ts
animal is Cat
```

可以理解成：

> **如果这个函数返回 `true`，就告诉 TypeScript：`animal` 现在就是 `Cat`。**

这样以后进入 `if` 分支时，就不用再写：

```ts
animal as Cat
```

一句话总结：

> **类型守卫负责判断类型，类型谓词负责把判断结果告诉 TypeScript，让它自动缩窄类型。**

## 如何做 API 类型约束？

> API 类型约束就是**给接口的请求参数和返回数据定义类型**，避免接口变更导致前端代码出错。

### 它解决了什么问题？

如果接口返回的数据结构发生变化：

* 编译阶段就能发现问题。
* 编辑器有代码提示。
* 减少因为字段名写错导致的运行时错误。

```ts id="4lpjlwm"
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

#### 白话理解

可以理解成：

> **提前告诉 TypeScript：这个接口会返回什么数据。**

以后：

```ts id="az4hjlwm"
res.data.name
```

会有类型提示。

如果接口删除了：

```ts id="y12kjlm"
name
```

编译阶段就会报错。

---

#### 常见做法

* 使用 `interface` 或 `type` 定义请求参数和返回值。
* 使用泛型封装统一请求方法。
* 配合 `keyof`、`extends` 实现通用表单、筛选条件等类型约束。

---

## 怎样实现前后端类型共享？

> 前后端类型共享就是**前后端共用一份类型定义**，避免接口文档和代码不一致。

### 它解决了什么问题？

以前：

后端改了接口字段。

前端：

```ts id="b91kjlm"
user.userName
```

后端：

```json id="c82kjlm"
{
  "name": "Tom"
}
```

运行才发现报错。

如果共享类型：

前后端都引用同一份类型，修改后编译阶段就能发现问题。

---

#### 常见方案

* **Monorepo / npm workspace**（目前最常见）

  * 前后端共用一个 `shared` 类型包。

* **OpenAPI（Swagger）生成 TypeScript 类型**

  * 根据接口文档自动生成类型，避免手写。

* **共享 DTO（interface / type）**

  * 前后端共同维护接口类型。

---

#### 一句话总结

> **核心思想就是：类型只维护一份，前后端共同使用。**

---

## TypeScript 的自动推导是怎样的？

> TypeScript 会根据上下文自动推导变量、函数、泛型等类型，大多数情况下不用手动声明。

### 自动推导

例如：

```ts id="k55kjlm"
let name = "Tom";
// string

let age = 18;
// number
```

函数返回值：

```ts id="d77kjlm"
function add(a: number, b: number) {
  return a + b;
}
// 返回值自动推导为 number
```

泛型：

```ts id="e44kjlm"
function identity<T>(value: T): T {
  return value;
}
```

调用：

```ts id="h99kjlm"
identity("hello");
// T 自动推导为 string
```

---

### `as const`

> **让字面量保持最精确的类型。**

#### 它解决了什么问题？

默认：

```ts id="j21kjlm"
const action = {
  type: "increment",
};
```

得到：

```ts id="m73kjlm"
type: string
```

使用：

```ts id="n62kjlm"
const action = {
  type: "increment",
} as const;
```

得到：

```ts id="q18kjlm"
type: "increment"
```

常用于：

* Redux Action
* 状态管理
* 常量配置

---

### `satisfies`

> **验证对象是否满足某个类型，但不会丢失自身推导出的具体类型。**

#### 它解决了什么问题？

既想检查对象是否符合要求，又希望保留对象最精确的类型。

```ts id="u37kjlm"
const config = {
  timeout: 5000,
  mode: "production",
} satisfies Record<string, number | string>;
```

这样：

* 会检查对象是否符合 `Record`。
* `timeout` 仍然保持 `5000`，不会变成普通的 `number`。

---

#### 一句话总结

* **自动推导**：能推导就不用手写类型。
* **`as const`**：让类型保持最精确。
* **`satisfies`**：既校验类型，又保留对象自身的推导结果。

## 什么是 `.d.ts` 声明文件？

> `.d.ts`（Declaration File）是 **TypeScript 的声明文件**，里面**只写类型声明，不写具体实现代码**。

### 它解决了什么问题？

TypeScript 在编译时需要知道：

* 一个函数有哪些参数？
* 返回什么类型？
* 一个对象有哪些属性？
* 一个模块导出了什么？

如果没有类型信息，TS 就无法进行类型检查和代码提示。

`.d.ts` 就是用来提供这些类型信息的。

---

### 白话理解

可以理解成：

> **".d.ts 就是一份说明书，只告诉 TypeScript 代码长什么样，不负责真正实现代码。"**

例如：

有一个 JS 文件：

```js
// utils.js

export function add(a, b) {
  return a + b;
}
```

JavaScript 没有类型。

可以写一个：

```ts
// utils.d.ts

export function add(a: number, b: number): number;
```

这样：

```ts
import { add } from "./utils";

add(1, 2);      // ✅
add("1", "2");  // ❌ TS 报错
```

真正执行的还是：

```js
utils.js
```

`.d.ts` 只是告诉 TypeScript：

> **这个函数应该怎么使用。**

---

### 项目中什么时候会用到？

#### ① 给 JavaScript 项目补充类型（最常见）

例如：

项目里有：

```txt
utils.js
```

为了让 TS 有类型提示，可以新增：

```txt
utils.d.ts
```

描述里面导出的函数、变量、类型。

---

#### ② 第三方库提供类型

例如：

```ts
import axios from "axios";
```

为什么输入：

```ts
axios.get()
```

编辑器会提示参数？

因为：

```txt
axios
```

安装时就自带了：

```txt
index.d.ts
```

TypeScript 会自动读取。

很多库：

* axios
* lodash
* react
* vue

都会提供 `.d.ts`。

---

#### ③ 自己声明模块

例如：

项目引用了：

```ts
import logo from "./logo.png";
```

TS 会报错：

```txt
Cannot find module './logo.png'
```

因为：

TS 不认识图片。

可以新增：

```ts
declare module "*.png";
```

之后：

```ts
import logo from "./logo.png";
```

就不会报错了。

---

### `.d.ts` 文件一般放哪里？

没有强制要求。

项目里常见放法：

```txt
src/
 ├── types/
 │    ├── global.d.ts
 │    ├── api.d.ts
 │    └── env.d.ts
```

或者：

```txt
types/
 ├── index.d.ts
```

只要：

```json
tsconfig.json
```

能够扫描到即可。

例如：

```json
{
  "include": [
    "src",
    "types"
  ]
}
```

---

### `.d.ts` 会不会打包？

不会。

`.d.ts` **只参与 TypeScript 编译检查。**

最终打包：

```txt
dist/
```

里面不会出现：

```txt
*.d.ts
```

---

### 一句话总结

> **`.d.ts` 是 TypeScript 的类型声明文件，只提供类型信息，不提供实现代码，主要用于给 JavaScript、第三方库或全局变量补充类型，让 TypeScript 能进行类型检查和代码提示。**

## Schema 校验（Zod）

### 什么是 Zod？

**Zod 是一个 TypeScript 优先的运行时 Schema 校验库。**

它既可以**校验数据是否合法**，又可以**根据 Schema 自动生成 TypeScript 类型**。

一句话理解：

> **用一份 Schema，同时完成数据校验和类型定义。**

---

## 为什么需要 Zod？

很多人以为 TypeScript 能保证接口返回的数据一定正确，其实不是。

例如：

```ts
interface User {
  id: number;
  name: string;
}
```

如果后端实际返回：

```json
{
  "id": "123",
  "name": "Tom"
}
```

TypeScript **不会在程序运行时检查**这个数据。

因为 **TS 只负责编译阶段的类型检查**，接口返回的数据属于运行时数据，仍然可能出现：

* 类型错误
* 字段缺失
* 字段为空
* 数据格式不正确

这些都会导致程序运行时报错。

---

## Zod 解决了什么问题？

Zod 会在**运行时**检查数据是否符合我们定义的 Schema。

例如：

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
});
```

收到接口数据后：

```ts
UserSchema.parse(data);
```

如果数据正确：

```json
{
  "id": 1,
  "name": "Tom"
}
```

校验通过。

如果返回：

```json
{
  "id": "1",
  "name": "Tom"
}
```

立即抛出错误：

```
Expected number
Received string
```

这样错误数据不会继续流入程序，提高了系统的健壮性。

---

## 为什么推荐使用 Zod？

以前通常需要维护两份代码：

第一份定义 TypeScript 类型：

```ts
interface User {
  id: number;
  name: string;
}
```

第二份自己写校验逻辑：

```ts
function validate(data) {
  ...
}
```

类型和校验容易不一致，维护成本高。

而 Zod 只需要维护一份 Schema：

```ts
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
});
```

再通过：

```ts
type User = z.infer<typeof UserSchema>;
```

自动生成 TypeScript 类型。

因此推荐把 **Schema 作为唯一的数据来源（Single Source of Truth）**，避免类型和校验逻辑分离。

---

## 基本使用

```ts
import { z } from "zod";

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

其中：

* `z.object()`：定义对象结构
* `parse()`：校验数据，不符合规则会抛出异常
* `z.infer`：根据 Schema 自动生成 TypeScript 类型

---

## 常见使用场景

### 1. 前端接口数据校验

接口返回的数据先经过 Zod 校验，再交给页面使用，避免后端返回异常数据导致页面崩溃。

```ts
const user = UserSchema.parse(res.data);
```

---

#### 2. 表单校验

```ts
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
```

提交表单前验证输入是否合法。

---

#### 3. 后端请求参数校验

```ts
LoginSchema.parse(req.body);
```

请求参数不合法时直接返回错误，避免非法数据进入业务逻辑。

---

#### 4. 前后端共享 Schema

同一份 Schema 可以同时用于：

* 前端类型
* 前端校验
* 后端校验
* 自动生成 TypeScript 类型

避免前后端数据结构不一致。

---

## 面试回答

> Zod 是一个 TypeScript 优先的运行时 Schema 校验库。它主要解决了 TypeScript 无法校验运行时数据的问题，例如接口返回的数据可能类型错误、字段缺失或格式不正确。通常我们会先定义一份 Schema，再通过 `parse()` 对数据进行运行时校验，同时使用 `z.infer` 自动生成 TypeScript 类型，实现类型定义和数据校验统一维护。Zod 常用于接口数据校验、表单校验以及前后端共享数据模型。
