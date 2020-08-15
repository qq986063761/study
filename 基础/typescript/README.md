# 推荐
- [官方文档](https://www.tslang.cn/docs/handbook/basic-types.html);


# 理论

## 编译ts
- 安装node编译器（npm install -g typescript）;
- 编译代码（tsc demo.ts）;


# api

## 基础类型
```ts
  // boolean
  let ready: boolean = true;
  // number 支持 16进制（0xf00d）、八进制（0o744）、二进制（0b1010）
  let num: number = 6;
  // string
  let myName: string = `name: ${ready}`;
  // array，两种方式：元素类型[] 和 泛型<元素类型>
  let list: number[] = [1, 2, 3];
  let list: Array<number> = [1, 2, 3];
  // 元组 Tuple，强制指定数据长度和类型
  let list: [string, number] = ['wanpeng', 1];
  // any 用于未知类型的预先定义，可被赋值成其它类型
  let notSure: any = 4;
  // void，常用于函数无返回值时作为返回的类型 只能赋值undefined 和 null；
  let unusable: void = undefined;
  // undefined 和 null
  let u: undefined = undefined;
  let n: null = null;
  // 对象类型
  let obj: object = {};
  // never类型，用在不存在返回值或者异常情况
  function error(message: string): never {
    throw new Error(message);
  }
```

## 接口
```ts
  // 定义对象接口类型（规定属性类型和性质）
  interface Lab {
    // 必填
    lab: string
  }
  // 接口继承（可继承多个接口，逗号间隔）
  interface LabValue extends Lab {
    // 可选
    size?: number;
    // 只读
    readonly require: boolean;
  }

  function printLab(obj: LabValue) {
    // 非必须实现属性可方便校验
    if (!obj.size) {
      console.log(`size: 暂无size属性`);
    } else {
      console.log(`size: ${obj.size}`);
    }

    // 采用类型断言，可让只读变量被修改
    let tmp = obj.require as boolean;
    tmp = false;
  }

  printLab({
    require: true, 
    size: 10, 
    lab: "很长的一段文本"
  });

  // 定义函数接口（规定参数类型和返回值类型）
  interface SearchFunc {
    (source: string, keyword: string): boolean;
  }

  let search: SearchFunc = function (source: string, keyword: string) {
    return keyword && source.indexOf(keyword) > -1;
  }
  
  // 定义索引类型接口（规定索引类型和值的类型）
  interface StringArray {
    [index: number]: string;
  }
  let list: StringArray;
  list = ["Bob", "Fred"];

  // 定义类类型接口（规定类属性和方法规则）
  interface ClockInterface {
    currentTime: Date
    callback(param: number): number
  }
  // 定义类的时候去实现接口的规则
  class Clock implements ClockInterface {
    currentTime: Date
    callback(param: number): number {return 0}
    constructor(h: number, m: number) {}
  }
```

## 类
```ts
  // 定义类
  class Animal {
    // 属性（private：私有、public：公有、protected：被保护的，允许子类内部访问、static：静态属性，所有实例公用一个变量、readonly：只读属性）
    protected name: string;
    // 只读，只允许声明初始化或构造中初始化
    readonly age: number = 24;

    // 构造函数
    constructor(name?: string) {
      this.name = name;
    }

    // 方法
    getName() {
      return this.name;
    }

    say() {
      alert(`my name is ${this.getName()}`);
    }
  }

  // 继承
  class Dog extends Animal {
    private _name: string;

    constructor(name?: string) { 
      // 继承父类构造
      super(name)
      this._name = name
    }

    // getters/setters截取属性
    get fullName(): string {
      return this._name;
    }

    set fullName(newName: string) {
      this._name = newName;
    }

    say() {
      alert(`wang wang`);
    }
  }

  // 抽象类
  abstract class PhoneFactory {
    // 抽象方法，子类必须实现
    abstract getPhone(type: string): void;
    // 非抽象方法可在抽象类中实现
    callPhone() {
      alert('嘀嘀嘀...')
    }
  }

  // 继承抽象类
  class IphoneFactory extends PhoneFactory {
    // 实现抽象方法
    getPhone(type: string): string {
      return `${type} phone`;
    }
  }
```

## 泛型
```ts
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
```

## 枚举
```ts
  // 默认从0递增，可自定义默认枚举值，往后枚举值以此递增
  enum Direction {
    Up = 1,
    Down,
    Left,
    Right
  }

  // 反向映射
  let dir = Direction.Up;
  let enumName = Direction[dir];

  // 常量枚举
  const enum Color {
    Red,
    Green,
    Blue
  }
```