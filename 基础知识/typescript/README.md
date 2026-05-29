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