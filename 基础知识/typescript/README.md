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

